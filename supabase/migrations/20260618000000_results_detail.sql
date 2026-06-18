-- Results detail RPC: returns vote metadata, options, and anonymous ballots
-- (each as an ordered array of option ids) so the client can tabulate any
-- voting method and explain the outcome. Ballots carry no voter identity, so
-- exposing the ranked option ids is safe. Password gating mirrors
-- get_vote_results_summary.

CREATE OR REPLACE FUNCTION public.get_vote_results_detail (
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
  v_hash text;
  v_options json;
  v_ballots json;
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

  SELECT coalesce(
    json_agg(
      json_build_object('id', vo.id, 'label', vo.label, 'sort_order', vo.sort_order)
      ORDER BY vo.sort_order
    ),
    '[]'::json
  )
  INTO v_options
  FROM public.vote_options vo
  WHERE vo.vote_id = v_vote.id;

  SELECT coalesce(
    (
      SELECT json_agg(t.ordered ORDER BY t.submitted_at, t.ballot_id)
      FROM (
        SELECT
          b.id AS ballot_id,
          b.submitted_at,
          json_agg(br.option_id ORDER BY br.rank) AS ordered
        FROM public.ballots b
        INNER JOIN public.ballot_rankings br ON br.ballot_id = b.id
        WHERE b.vote_id = v_vote.id
        GROUP BY b.id, b.submitted_at
      ) t
    ),
    '[]'::json
  )
  INTO v_ballots;

  RETURN json_build_object(
    'vote',
    json_build_object(
      'id', v_vote.id,
      'public_id', v_vote.public_id,
      'title', v_vote.title,
      'voting_method', v_vote.voting_method,
      'locked_at', v_vote.locked_at,
      'password_protected', v_vote.password_protected
    ),
    'options',
    v_options,
    'ballots',
    v_ballots
  );
END;
$$;

REVOKE ALL ON FUNCTION public.get_vote_results_detail (text, text) FROM PUBLIC;

GRANT EXECUTE ON FUNCTION public.get_vote_results_detail (text, text) TO anon, authenticated;
