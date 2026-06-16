-- Row Level Security for anonymous (no-login) Ballot Box access.
-- Frontend uses the publishable API key (Postgres role `anon`); policies enforce product rules.
-- Votes are read-only after creation; ballots are write-once per vote.

-- -----------------------------------------------------------------------------
-- Schema hardening
-- -----------------------------------------------------------------------------

ALTER TABLE public.votes
ADD COLUMN IF NOT EXISTS password_protected boolean NOT NULL DEFAULT false;

UPDATE public.votes
SET
  password_protected = (password_hash IS NOT NULL)
WHERE
  password_protected = false
  AND password_hash IS NOT NULL;

ALTER TABLE public.ballots
ADD CONSTRAINT ballots_vote_id_unique UNIQUE (vote_id);

-- -----------------------------------------------------------------------------
-- Helpers
-- -----------------------------------------------------------------------------

CREATE EXTENSION IF NOT EXISTS pgcrypto WITH SCHEMA extensions;

CREATE OR REPLACE FUNCTION public.hash_vote_password (plain text)
RETURNS text
LANGUAGE sql
IMMUTABLE
STRICT
SET search_path = public, extensions
AS $$
  SELECT encode(extensions.digest(convert_to(trim(plain), 'UTF8'), 'sha256'), 'hex');
$$;

CREATE OR REPLACE FUNCTION public.vote_accepts_ballots (vote_uuid uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY INVOKER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.votes v
    WHERE v.id = vote_uuid
      AND v.locked_at IS NULL
      AND NOT EXISTS (
        SELECT 1
        FROM public.ballots b
        WHERE b.vote_id = v.id
      )
  );
$$;

CREATE OR REPLACE FUNCTION public.lock_vote_on_first_ballot ()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  UPDATE public.votes
  SET locked_at = now()
  WHERE id = NEW.vote_id
    AND locked_at IS NULL;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS ballots_lock_vote ON public.ballots;

CREATE TRIGGER ballots_lock_vote
AFTER INSERT ON public.ballots
FOR EACH ROW
EXECUTE FUNCTION public.lock_vote_on_first_ballot ();

-- -----------------------------------------------------------------------------
-- Privileged RPCs (anon cannot mutate votes after creation)
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.create_vote_with_options (
  p_public_id text,
  p_title text,
  p_voting_method text,
  p_password text,
  p_option_labels text[]
)
RETURNS uuid
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vote_id uuid;
  v_hash text;
  label text;
  i integer := 0;
BEGIN
  IF trim(coalesce(p_public_id, '')) = '' OR trim(coalesce(p_title, '')) = '' THEN
    RAISE EXCEPTION 'public_id and title are required';
  END IF;

  IF p_option_labels IS NULL OR array_length(p_option_labels, 1) < 2 THEN
    RAISE EXCEPTION 'At least two options are required';
  END IF;

  v_hash := CASE
    WHEN trim(coalesce(p_password, '')) = '' THEN NULL
    ELSE public.hash_vote_password (p_password)
  END;

  INSERT INTO public.votes (public_id, title, voting_method, password_hash, password_protected)
  VALUES (
    trim(p_public_id),
    trim(p_title),
    p_voting_method,
    v_hash,
    v_hash IS NOT NULL
  )
  RETURNING id INTO v_vote_id;

  FOREACH label IN ARRAY p_option_labels LOOP
    IF trim(label) = '' THEN
      CONTINUE;
    END IF;
    INSERT INTO public.vote_options (vote_id, sort_order, label)
    VALUES (v_vote_id, i, trim(label));
    i := i + 1;
  END LOOP;

  IF i < 2 THEN
    RAISE EXCEPTION 'At least two non-empty options are required';
  END IF;

  RETURN v_vote_id;
END;
$$;

CREATE OR REPLACE FUNCTION public.get_vote_results_summary (
  p_public_id text,
  p_password text DEFAULT NULL
)
RETURNS json
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_vote public.votes%ROWTYPE;
  v_count integer;
  v_winner_label text;
  v_hash text;
BEGIN
  SELECT *
  INTO v_vote
  FROM public.votes
  WHERE public_id = trim(p_public_id);

  IF NOT FOUND THEN
    RETURN NULL;
  END IF;

  IF v_vote.password_protected THEN
    IF trim(coalesce(p_password, '')) = '' THEN
      RAISE EXCEPTION 'PASSWORD_REQUIRED';
    END IF;
    v_hash := public.hash_vote_password (p_password);
    IF v_vote.password_hash IS DISTINCT FROM v_hash THEN
      RAISE EXCEPTION 'INVALID_PASSWORD';
    END IF;
  END IF;

  SELECT count(*)::integer
  INTO v_count
  FROM public.ballots
  WHERE vote_id = v_vote.id;

  SELECT vo.label
  INTO v_winner_label
  FROM (
    SELECT br.option_id, count(*) AS c
    FROM public.ballot_rankings br
    INNER JOIN public.ballots b ON b.id = br.ballot_id
    WHERE b.vote_id = v_vote.id
      AND br.rank = 1
    GROUP BY br.option_id
    ORDER BY c DESC
    LIMIT 1
  ) tops
  INNER JOIN public.vote_options vo ON vo.id = tops.option_id;

  RETURN json_build_object(
    'vote_id',
    v_vote.id,
    'public_id',
    v_vote.public_id,
    'title',
    v_vote.title,
    'voting_method',
    v_vote.voting_method,
    'locked_at',
    v_vote.locked_at,
    'password_protected',
    v_vote.password_protected,
    'response_count',
    v_count,
    'winner_label',
    coalesce(v_winner_label, '—')
  );
END;
$$;

REVOKE ALL ON FUNCTION public.hash_vote_password (text) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.create_vote_with_options (text, text, text, text, text[]) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.get_vote_results_summary (text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.create_vote_with_options (text, text, text, text, text[]) TO anon, authenticated;

GRANT EXECUTE ON FUNCTION public.get_vote_results_summary (text, text) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.submit_ballot (
  p_vote_id uuid,
  p_option_ids uuid[]
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_ballot_id uuid;
  i integer;
  option_id uuid;
BEGIN
  IF NOT public.vote_accepts_ballots (p_vote_id) THEN
    RAISE EXCEPTION 'Vote is not accepting ballots';
  END IF;

  IF p_option_ids IS NULL OR array_length(p_option_ids, 1) < 1 THEN
    RAISE EXCEPTION 'At least one ranking is required';
  END IF;

  FOREACH option_id IN ARRAY p_option_ids LOOP
    IF NOT EXISTS (
      SELECT 1
      FROM public.vote_options vo
      WHERE vo.vote_id = p_vote_id
        AND vo.id = option_id
    ) THEN
      RAISE EXCEPTION 'Invalid option for this vote';
    END IF;
  END LOOP;

  INSERT INTO public.ballots (vote_id)
  VALUES (p_vote_id)
  RETURNING id INTO v_ballot_id;

  FOR i IN 1..array_length(p_option_ids, 1) LOOP
    INSERT INTO public.ballot_rankings (ballot_id, option_id, rank)
    VALUES (v_ballot_id, p_option_ids[i], i);
  END LOOP;
END;
$$;

REVOKE ALL ON FUNCTION public.submit_ballot (uuid, uuid[]) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.submit_ballot (uuid, uuid[]) TO anon, authenticated;

-- -----------------------------------------------------------------------------
-- Column grants: hide password_hash from anon reads
-- -----------------------------------------------------------------------------

REVOKE ALL ON TABLE public.votes FROM anon;

GRANT SELECT (
  id,
  public_id,
  title,
  voting_method,
  locked_at,
  password_protected,
  created_at,
  updated_at
) ON public.votes TO anon;

REVOKE ALL ON TABLE public.vote_options FROM anon;

GRANT SELECT ON TABLE public.vote_options TO anon;

REVOKE ALL ON TABLE public.ballots FROM anon;

REVOKE ALL ON TABLE public.ballot_rankings FROM anon;

-- -----------------------------------------------------------------------------
-- Enable RLS
-- -----------------------------------------------------------------------------

ALTER TABLE public.votes ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.vote_options ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ballots ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.ballot_rankings ENABLE ROW LEVEL SECURITY;

-- -----------------------------------------------------------------------------
-- votes (read-only for anon; creation via RPC)
-- -----------------------------------------------------------------------------

CREATE POLICY votes_anon_select ON public.votes
FOR SELECT
TO anon
USING (true);

-- -----------------------------------------------------------------------------
-- vote_options (read-only for anon)
-- -----------------------------------------------------------------------------

CREATE POLICY vote_options_anon_select ON public.vote_options
FOR SELECT
TO anon
USING (true);

-- Ballots and rankings: no anon table access; use submit_ballot() RPC.
