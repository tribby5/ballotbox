<script lang="ts">
  import type { VoteResultsSummary } from './voteResultsRecord';

  let {
    summary,
    methodLabel,
    voteCountLine,
  }: {
    summary: VoteResultsSummary;
    methodLabel: string;
    voteCountLine: string;
  } = $props();
</script>

<header class="bb-page-head">
  <h1 class="bb-page-title">{summary.vote.title}</h1>
  <p class="bb-page-sub">{voteCountLine}</p>
</header>

<section
  class="winner-card bb-surface bb-surface--wide bb-surface--winner bb-mx-auto"
  aria-labelledby="winner-heading"
>
  <p id="winner-heading" class="winner-kicker">Winner</p>
  <p class="winner-name">{summary.winnerLabel}</p>
  <p class="winner-method">Using {methodLabel}</p>
</section>

<section
  class="bb-surface bb-surface--padded bb-surface--wide bb-surface--stack-tight bb-mx-auto"
  aria-labelledby="detail-heading"
>
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
