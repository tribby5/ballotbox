<script lang="ts">
  import type { ResultsComputation } from '$lib/results/tabulation';

  let { computation }: { computation: ResultsComputation } = $props();

  const maxBar = $derived.by(() => {
    const values = computation.chart.bars.map((b) => b.value);
    return Math.max(1, ...values);
  });

  function barWidth(value: number): string {
    return `${Math.round((value / maxBar) * 100)}%`;
  }
</script>

<div class="detail-stack">
  <section class="detail-block" aria-labelledby="ranking-heading">
    <h3 id="ranking-heading" class="block-title">Final Ranking</h3>
    <ol class="ranking-list">
      {#each computation.ranking as entry (entry.optionId)}
        <li class="ranking-row" class:ranking-row--winner={entry.rank === 1}>
          <span class="ranking-rank">#{entry.rank}</span>
          <span class="ranking-label">{entry.label}</span>
          {#if entry.tied}
            <span class="ranking-tie">tied</span>
          {/if}
        </li>
      {/each}
    </ol>
  </section>

  <section class="detail-block" aria-labelledby="chart-heading">
    <h3 id="chart-heading" class="block-title">{computation.chart.title}</h3>
    <ul class="chart-list">
      {#each computation.chart.bars as bar (bar.optionId)}
        <li class="chart-row">
          <span class="chart-label" title={bar.label}>{bar.label}</span>
          <span class="chart-track">
            <span
              class="chart-fill"
              class:chart-fill--winner={bar.isWinner}
              style:width={barWidth(bar.value)}
            ></span>
          </span>
          <span class="chart-value">{bar.value}</span>
        </li>
      {/each}
    </ul>
    <p class="chart-unit">Measured in {computation.chart.unit}.</p>
  </section>

  <section class="detail-block" aria-labelledby="steps-heading">
    <h3 id="steps-heading" class="block-title">How the winner was decided</h3>
    <ol class="steps-list">
      {#each computation.steps as step, i (i)}
        <li class="step-row">
          <span class="step-heading">{step.heading}</span>
          <span class="step-detail">{step.detail}</span>
        </li>
      {/each}
    </ol>
  </section>

  {#if computation.pairwise}
    <section class="detail-block" aria-labelledby="pairwise-heading">
      <h3 id="pairwise-heading" class="block-title">Head-to-head matchups</h3>
      <p class="pairwise-hint">
        Each cell shows how many voters preferred the row option over the column option.
      </p>
      <div class="pairwise-scroll">
        <table class="pairwise-table">
          <thead>
            <tr>
              <th scope="col" class="corner"></th>
              {#each computation.pairwise.options as col (col.id)}
                <th scope="col" title={col.label}>{col.label}</th>
              {/each}
            </tr>
          </thead>
          <tbody>
            {#each computation.pairwise.options as row, i (row.id)}
              <tr>
                <th scope="row" title={row.label}>{row.label}</th>
                {#each computation.pairwise.options as col, j (col.id)}
                  {#if i === j}
                    <td class="diag" aria-hidden="true">—</td>
                  {:else}
                    <td class:beats={computation.pairwise.matrix[i][j] > computation.pairwise.matrix[j][i]}>
                      {computation.pairwise.matrix[i][j]}
                    </td>
                  {/if}
                {/each}
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    </section>
  {/if}
</div>

<style>
  .detail-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .block-title {
    margin: 0 0 var(--space-1);
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .ranking-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .ranking-row {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px 14px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .ranking-row--winner {
    border-color: var(--accent);
    background: var(--bg-icon);
  }

  .ranking-rank {
    flex-shrink: 0;
    min-width: 2rem;
    font-size: 14px;
    color: var(--text-muted);
  }

  .ranking-label {
    flex: 1;
    min-width: 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .ranking-tie {
    flex-shrink: 0;
    font-size: 12px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
    color: var(--text-muted);
  }

  .chart-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .chart-row {
    display: grid;
    grid-template-columns: minmax(5rem, 8rem) 1fr auto;
    align-items: center;
    gap: 10px;
  }

  .chart-label {
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .chart-track {
    position: relative;
    height: 20px;
    border-radius: 999px;
    background: var(--bg-share-url);
    overflow: hidden;
  }

  .chart-fill {
    position: absolute;
    inset: 0 auto 0 0;
    border-radius: 999px;
    background: var(--border-strong, #9aa6a0);
    min-width: 2px;
    transition: width 0.3s ease;
  }

  .chart-fill--winner {
    background: var(--accent);
  }

  .chart-value {
    font-size: 14px;
    color: var(--text-muted);
    min-width: 2rem;
    text-align: right;
  }

  .chart-unit {
    margin: var(--space-1) 0 0;
    font-size: 13px;
    color: var(--text-muted);
  }

  .steps-list {
    margin: 0;
    padding: 0;
    list-style: none;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .step-row {
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding-left: 14px;
    border-left: 2px solid var(--border-subtle);
  }

  .step-heading {
    font-size: 13px;
    font-weight: 600;
    color: var(--text-primary);
  }

  .step-detail {
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .pairwise-hint {
    margin: 0 0 var(--space-1);
    font-size: 13px;
    color: var(--text-muted);
  }

  .pairwise-scroll {
    overflow-x: auto;
  }

  .pairwise-table {
    border-collapse: collapse;
    font-size: 13px;
    width: 100%;
  }

  .pairwise-table th,
  .pairwise-table td {
    border: 1px solid var(--border-subtle);
    padding: 6px 10px;
    text-align: center;
    color: var(--text-primary);
    white-space: nowrap;
  }

  .pairwise-table thead th,
  .pairwise-table tbody th {
    font-weight: 500;
    color: var(--text-muted);
    max-width: 8rem;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .pairwise-table .corner {
    border: none;
  }

  .pairwise-table .diag {
    color: var(--text-muted);
    background: var(--bg-share-url);
  }

  .pairwise-table .beats {
    font-weight: 600;
    color: var(--accent);
  }
</style>
