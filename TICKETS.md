# Ballot Box — Tickets to Finish v1

Goal: finish the app in the spirit of [`product-spec.md`](product-spec.md) — a clean,
education-first ranked-choice voting app where the **voting method actually decides the
winner** and the results page **explains how**.

Status snapshot (what's done): home, create, vote (drag + numeric), manage, and the
education page are all built and styled. The gap is the core: real tabulation and the
detailed results experience. Tickets are ordered by priority.

---

## BB-1 — Build the tabulation engine (the core)

**Problem:** `get_vote_results_summary` only counts first-place votes (plurality) and
returns that winner for *every* method. The ranked-choice methods — the whole point of
the app — are not implemented.

**Scope:**
- Implement all 6 methods over ranked ballots: Single Vote Plurality, IRV, Borda Count,
  Instant Runoff Borda Count, Least Worst Defeat, Ranked Pairs.
- Build it in the Python backend (`backend/src/ballotbox/`) as a pure, dependency-free
  module — it's complex (cycles, pairwise matrices) and deserves real unit tests.
- Define a typed result shape that carries more than a winner: winner, full ranking, and
  per-method breakdown data (round eliminations, Borda scores, pairwise matrix, locked
  pairs) so BB-3 can render explanations.
- Deterministic, documented tie-breaking.

**Done when:** each method has unit tests with worked examples (including a Condorcet
winner case and an IRV non-monotonic case), and `make backend-check` passes.

---

## BB-2 — Expose results via the backend and wire the frontend to it

**Problem:** the frontend reads results straight from a Supabase RPC. Tabulation now lives
in Python (BB-1), so results need a path out.

**Scope:**
- Add `GET /votes/{public_id}/results` to the FastAPI app; it loads ballots via the
  Supabase client, runs the BB-1 engine, and returns winner + ranking + breakdown.
- Preserve current behavior: password gating (`PASSWORD_REQUIRED` / `INVALID_PASSWORD`),
  `not_found`, and response count.
- Point `fetchVoteResultsSummary` at the new endpoint; keep the same
  `VoteResultsFetchResult` union so the page barely changes.

**Done when:** the results page shows the correct winner for a non-plurality method end to
end. (Decision to confirm: backend endpoint vs. extending the Postgres RPC — backend is
recommended for testability.)

---

## BB-3 — Detailed results: ranking, breakdown, and "how the winner was decided" — DONE

**Problem:** the results page renders a "Detailed Results" card that is an empty
`coming soon` placeholder. Spec §4 wants full ranking, vote breakdown, and a per-method
explanation of the calculation.

**Scope:**
- Full final ranking of all options.
- Per-method explanation using BB-1 breakdown data (e.g. IRV round-by-round transfers,
  Borda point tally, pairwise table + locked pairs for Condorcet methods).
- A simple chart/diagram for the primary tally (bar chart is enough for v1).
- Make the existing collapsible card actually expand/collapse.

**Done when:** opening Detailed Results explains the outcome for each method type.

**Status — shipped.** To make BB-3 real I folded in the engine (BB-1) and a data path
(BB-2) on the **frontend** rather than the Python backend, so the feature works end to end
now without standing up/deploying Lambda. If we still want server-side tabulation later,
BB-1/BB-2 can port `tabulation.ts` to Python and repoint the fetch.

- Engine: `frontend/src/lib/results/tabulation.ts` — all 6 methods produce winner, full
  ranking, a primary-tally chart, ordered explanation steps, and (for Condorcet methods)
  a pairwise matrix. Deterministic tie-breaking by sort order. Tested in
  `tabulation.spec.ts` (Condorcet winner, IRV≠plurality, ranked-pairs cycle skip).
- Data: `supabase/migrations/20260618000000_results_detail.sql` adds
  `get_vote_results_detail` (SECURITY DEFINER, password-gated) returning vote metadata,
  options, and anonymous ballots as ordered option-id arrays.
- Fetch: `voteResultsRecord.ts` now calls the detail RPC and runs the engine; winner is
  computed by the chosen method (no longer plurality-only).
- UI: `ResultsDetail.svelte` (ranking + bar chart + steps + pairwise table) inside a
  working collapsible in `ResultsPage.svelte`; multi-winner/tie and zero-ballot states
  handled.

**Follow-ups deferred to other tickets:** BB-2 still tracks the optional Python port; the
zero-ballot empty state landed here but richer tie presentation stays in BB-4.

---

## BB-4 — Results empty state and tie handling

**Problem:** winner currently falls back to an em dash; there's no real handling for "no
ballots yet" or genuine ties.

**Scope:**
- Clear empty state when a vote has zero responses.
- Explicit tie presentation (shared winner / tied ranking) consistent with BB-1's
  tie-breaking rules.

**Done when:** zero-ballot and tied scenarios render sensible, non-broken UI.

---

## BB-5 — Live results updates

**Problem:** spec describes results as a live-updating link; today it's a one-time fetch
on mount.

**Scope:**
- Subscribe to new ballots (Supabase Realtime on `ballots` for the vote) and refresh
  results, or poll on a sensible interval as a fallback.
- Clean up subscriptions on unmount.

**Done when:** an open results page reflects a newly submitted ballot without a manual
reload.

---

## BB-6 — Keyboard-accessible ranking (drag-and-drop a11y)

**Problem:** drag-and-drop has no keyboard path. Numeric mode is the only accessible
option, which undercuts the "clean, trustworthy, accessible" intent.

**Scope:**
- Add keyboard reordering (move up/down) to the drag list with proper ARIA, or document
  numeric mode as the accessible equivalent and make that obvious in the UI.

**Done when:** a keyboard-only user can complete and submit a ranking.

---

## BB-7 — End-to-end verification of the full flow

**Problem:** there are component specs but no confidence check across
create → share → vote → lock → results for a real ranked method.

**Scope:**
- An e2e or integration test covering: create a vote, submit several ranked ballots,
  confirm the vote locks on first ballot, and verify the computed winner/breakdown.
- Include a password-protected vote path.

**Done when:** `make check` exercises the happy path and one password path green.
