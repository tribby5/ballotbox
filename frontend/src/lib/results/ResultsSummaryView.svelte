<script lang="ts">
  import type { VoteResultsSummary } from './voteResultsRecord';
  import ResultsDetail from './ResultsDetail.svelte';

  let {
    summary,
    methodLabel,
    voteCountLine,
  }: {
    summary: VoteResultsSummary;
    methodLabel: string;
    voteCountLine: string;
  } = $props();

  let detailExpanded = $state(true);

  const winnerName = $derived(
    summary.winnerLabels.length === 0 ? '—' : summary.winnerLabels.join(' & '),
  );
  const winnerKicker = $derived(summary.winnerLabels.length > 1 ? 'Tied winners' : 'Winner');
</script>

<header class="bb-page-head">
  <h1 class="bb-page-title">{summary.vote.title}</h1>
  <p class="bb-page-sub">{voteCountLine}</p>
</header>

{#if summary.responseCount === 0}
  <section class="bb-surface bb-surface--padded bb-surface--wide bb-mx-auto empty-card">
    <p class="empty-title">No votes yet</p>
    <p class="empty-sub">Results will appear here once the first ballot is submitted.</p>
  </section>
{:else}
  <section
    class="winner-card bb-surface bb-surface--wide bb-surface--winner bb-mx-auto"
    aria-labelledby="winner-heading"
  >
    <p id="winner-heading" class="winner-kicker">{winnerKicker}</p>
    <p class="winner-name">{winnerName}</p>
    <p class="winner-method">Using {methodLabel}</p>
  </section>

  <section
    class="bb-surface bb-surface--padded bb-surface--wide bb-surface--stack-tight bb-mx-auto"
    aria-labelledby="detail-heading"
  >
    <button
      type="button"
      class="detail-card-head"
      aria-expanded={detailExpanded}
      aria-controls="detail-body"
      onclick={() => (detailExpanded = !detailExpanded)}
    >
      <h2 id="detail-heading" class="detail-title">Detailed Results</h2>
      <span class="detail-chevron" class:detail-chevron--open={detailExpanded} aria-hidden="true">
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
    </button>
    {#if detailExpanded}
      <div id="detail-body" class="detail-body">
        {#if summary.computation}
          <ResultsDetail computation={summary.computation} />
        {:else}
          <p class="empty-sub">Detailed breakdown is unavailable for this vote.</p>
        {/if}
      </div>
    {/if}
  </section>
{/if}

<style>
  .winner-kicker {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: var(--text-muted);
  }

  .winner-name {
    margin: var(--space-1) 0 6px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: clamp(28px, 4vw, 36px);
    line-height: 1.1;
    color: var(--accent);
  }

  .winner-method {
    margin: 0;
    font-size: 14px;
    color: var(--text-muted);
  }

  .detail-card-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 0;
    border: none;
    background: none;
    cursor: pointer;
    text-align: left;
    color: inherit;
  }

  .detail-card-head:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
    border-radius: var(--radius-md);
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
    display: inline-flex;
    color: var(--text-muted);
    transition: transform 0.2s ease;
  }

  .detail-chevron--open {
    transform: rotate(180deg);
  }

  .empty-card {
    text-align: center;
  }

  .empty-title {
    margin: 0 0 6px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 20px;
    color: var(--text-primary);
  }

  .empty-sub {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
