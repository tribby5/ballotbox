# AGENTS.md

Instructions for AI coding agents working in this repository.

## What this is

**Ballot Box** — open-source web app for creating and running elections with multiple voting methods (ranked-choice focus). SvelteKit frontend talks to Supabase directly (anon key + RLS). FastAPI backend for health/config and future API work.

Read **`product-spec.md`** before changing vote lifecycle, ballots, passwords, or results behavior.

Read **`README.dev.md`** for layout, entry points, and local setup.

## Commands (Makefile only)

Use **`make …`** targets from the repo root — not ad-hoc `cd frontend && npm …` unless debugging a single package.

| Task | Command |
|------|---------|
| Install everything | `make install` |
| All tests | `make test` |
| Lint + types + fallow audit + tests | `make check` (alias: `make code-quality`) |
| Fallow audit only (changed files) | `make frontend-fallow-audit` |
| Fallow health + letter grade | `make frontend-fallow-health` |
| Full Fallow report (whole frontend) | `make frontend-fallow` |
| Frontend dev server | `make frontend-run` |
| Backend dev server | `make backend-run` |

Pre-commit runs `make code-quality` via Husky.

## Verification before “done”

1. Run **`make check`** and confirm it passes.
2. Paste or summarize the result when reporting completion.

For **multi-step plan execution** (substantial feature work, not simple Q&A): create an empty marker at the start:

```bash
touch .cursor/verify-on-stop
```

The Cursor **stop hook** runs `make check` when that marker exists, then removes it on success. Simple questions and small edits should **not** create the marker.

## Conventions

- YAGNI / minimal diff — see `.cursor/rules/ponytail-lazy-senior-dev.mdc`
- Non-trivial logic needs a test that would fail if the logic breaks
- Frontend: Vitest specs live next to features (`frontend/src/lib/**/*.spec.ts`)
- Backend: pytest in `backend/tests/`
- Supabase: new migrations only in `supabase/migrations/` — never edit applied migrations

## Don't

- Don't commit `.env`, secrets, or service-role keys
- Don't put `SUPABASE_KEY` (service role) in the frontend
- Don't `git push --force` to main
- Don't claim work is complete without running `make check`
