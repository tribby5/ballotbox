<script lang="ts">
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import { VOTING_METHODS } from '$lib/votingMethods';
  import type { VoteResultsSummary } from '$lib/results/voteResultsRecord';

  let { summary }: { summary: VoteResultsSummary } = $props();

  const methodLabel = $derived(
    VOTING_METHODS.find((m) => m.value === summary.vote.voting_method)?.label ?? 'Unknown method',
  );

  const voteCountLine = $derived(
    `${summary.responseCount} ${summary.responseCount === 1 ? 'vote' : 'votes'} received`,
  );
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner bb-page-inner--results">
    <header class="bb-page-head">
      <h1 class="bb-page-title">{summary.vote.title}</h1>
      <p class="bb-page-sub">{voteCountLine}</p>
    </header>

    <section class="winner-card bb-surface bb-surface--wide bb-surface--winner bb-mx-auto" aria-labelledby="winner-heading">
      <p id="winner-heading" class="winner-kicker">Winner</p>
      <p class="winner-name">{summary.winnerLabel}</p>
      <p class="winner-method">Using {methodLabel}</p>
    </section>

    <section class="bb-surface bb-surface--padded bb-surface--wide bb-surface--stack-tight bb-mx-auto" aria-labelledby="detail-heading">
      <div class="detail-card-head">
        <h2 id="detail-heading" class="detail-title">Detailed Results</h2>
        <span class="detail-chevron" aria-hidden="true">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            <path
              d="M5 7.5 10 12.5 15 7.5"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </span>
      </div>
      <div class="detail-body" aria-label="Detailed results (coming soon)"></div>
    </section>
  </div>
</div>

<style>
  .winner-kicker {
    margin: 0 0 8px;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--text-muted);
  }

  .winner-name {
    margin: 0 0 8px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 48px;
    line-height: 48px;
    color: var(--accent);
  }

  .winner-method {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    font-weight: 400;
    color: var(--text-muted);
  }

  .detail-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    min-height: 27px;
  }

  .detail-title {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: var(--text-primary);
  }

  .detail-chevron {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--text-muted);
  }

  .detail-body {
    min-height: 200px;
  }
</style>
