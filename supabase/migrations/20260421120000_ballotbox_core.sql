-- Ballot Box core schema: votes, options, anonymous ballots, rankings.
-- See product-spec.md for domain rules.

-- -----------------------------------------------------------------------------
-- Tables
-- -----------------------------------------------------------------------------

CREATE TABLE public.votes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  public_id text NOT NULL,
  title text NOT NULL,
  voting_method text NOT NULL DEFAULT 'ranked_pairs',
  password_hash text,
  locked_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT votes_public_id_key UNIQUE (public_id),
  CONSTRAINT votes_password_hash_nonempty CHECK (
    password_hash IS NULL
    OR length(trim(password_hash)) > 0
  )
);

CREATE TABLE public.vote_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  vote_id uuid NOT NULL REFERENCES public.votes (id) ON DELETE CASCADE,
  sort_order integer NOT NULL,
  label text NOT NULL,
  CONSTRAINT vote_options_vote_id_sort_order_key UNIQUE (vote_id, sort_order),
  CONSTRAINT vote_options_sort_order_nonnegative CHECK (sort_order >= 0)
);

CREATE TABLE public.ballots (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid (),
  vote_id uuid NOT NULL REFERENCES public.votes (id) ON DELETE CASCADE,
  submitted_at timestamptz NOT NULL DEFAULT now()
);

CREATE TABLE public.ballot_rankings (
  ballot_id uuid NOT NULL REFERENCES public.ballots (id) ON DELETE CASCADE,
  option_id uuid NOT NULL REFERENCES public.vote_options (id) ON DELETE CASCADE,
  rank integer NOT NULL,
  CONSTRAINT ballot_rankings_pkey PRIMARY KEY (ballot_id, option_id),
  CONSTRAINT ballot_rankings_ballot_id_rank_key UNIQUE (ballot_id, rank),
  CONSTRAINT ballot_rankings_rank_positive CHECK (rank >= 1)
);

CREATE INDEX vote_options_vote_id_idx ON public.vote_options (vote_id);

CREATE INDEX ballots_vote_id_idx ON public.ballots (vote_id);

CREATE INDEX ballot_rankings_ballot_id_idx ON public.ballot_rankings (ballot_id);

CREATE INDEX ballot_rankings_option_id_idx ON public.ballot_rankings (option_id);

-- -----------------------------------------------------------------------------
-- Functions & triggers
-- -----------------------------------------------------------------------------

CREATE OR REPLACE FUNCTION public.set_updated_at ()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$;

CREATE TRIGGER votes_set_updated_at
BEFORE UPDATE ON public.votes
FOR EACH ROW
EXECUTE FUNCTION public.set_updated_at ();

-- -----------------------------------------------------------------------------
-- Grants (PostgREST)
-- -----------------------------------------------------------------------------

GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.votes TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.vote_options TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ballots TO anon, authenticated, service_role;

GRANT SELECT, INSERT, UPDATE, DELETE ON TABLE public.ballot_rankings TO anon, authenticated, service_role;
