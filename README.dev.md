# Ballot Box — developer guide

For humans and AI agents. Product behavior lives in **`product-spec.md`**. Agent instructions in **`AGENTS.md`**.

## Stack

| Area | Tech | Version notes |
|------|------|---------------|
| Frontend | SvelteKit 2, Svelte 5, TypeScript, Vitest | Node **24.15** (`.nvmrc`) |
| Backend | FastAPI, uv, pytest, ruff, mypy | Python **3.14** (`.python-version`) |
| Data | Supabase (Postgres + RLS) | Migrations in `supabase/migrations/` |
| Repo glue | Root Makefile, Husky pre-commit | `make check` = full quality gate |

## Layout

```
frontend/           SvelteKit app (static adapter)
  src/routes/       Pages: home, create, vote, manage, results, methods
  src/lib/          Components, Supabase helpers, voting logic, specs
backend/
  src/ballotbox/    FastAPI app (health, config probes; Lambda via Mangum)
  tests/            pytest
supabase/
  migrations/       Schema + RLS (source of truth for DB)
  config.toml       Local Supabase CLI config
product-spec.md     Domain rules (vote states, passwords, methods)
```

## Local setup

**Prerequisites:** Node 24.15+, Python 3.14 (via `uv`), [Supabase CLI](https://supabase.com/docs/guides/cli) for local DB (optional but needed for full frontend flows).

```bash
make install          # backend + frontend + husky
```

**Environment files** (copy from examples, never commit):

- `frontend/.env` — `SUPABASE_URL`, `SUPABASE_PUBLISHABLE_KEY` (anon/publishable key only)
- `backend/.env` — `SUPABASE_URL`, `SUPABASE_KEY` (backend key; not for browser)

**Supabase local** (from repo root):

```bash
supabase start
# Use local API URL + anon key in frontend/.env (supabase status shows values)
supabase db reset     # apply migrations from supabase/migrations/
```

**Run dev servers:**

```bash
make frontend-run     # SvelteKit (default Vite port)
make backend-run      # FastAPI on http://127.0.0.1:8000
```

## Entry points

| Concern | Where to start |
|---------|----------------|
| Browser Supabase client | `frontend/src/lib/supabaseClient.ts` |
| Create vote RPC | `frontend/src/lib/vote/createVote.ts` |
| Submit ballot | `frontend/src/lib/vote/submitBallot.ts` |
| Voting methods list | `frontend/src/lib/votingMethods.ts` |
| API app | `backend/src/ballotbox/main.py` |
| Core schema | `supabase/migrations/20260421120000_ballotbox_core.sql` |
| RLS + RPCs | `supabase/migrations/20260616120000_ballotbox_rls.sql` |

## Tests

```bash
make test             # backend pytest + frontend vitest
make check            # + ruff, mypy, svelte-check, eslint
```

Frontend specs: `frontend/src/lib/**/*.spec.ts` (Testing Library + Vitest).  
Backend: `backend/tests/`.

## Risky areas (read product-spec first)

- **Vote locking** — editable until first ballot; then `locked_at` / RLS blocks edits
- **One ballot per vote** — enforced in DB (`ballots_vote_id_unique`)
- **Password hashing** — `hash_vote_password` in migrations; never store plaintext
- **RLS policies** — frontend uses `anon` role; policy changes need migration + review

## Cursor stop hook

For multi-step agent work, create `.cursor/verify-on-stop` at plan start. On agent turn completion, `.cursor/hooks/verify.sh` runs `make check` and auto-prompts fixes (up to 3 loops). Simple Q&A should not use the marker.
