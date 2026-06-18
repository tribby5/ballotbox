<script lang="ts">
  import VoteNumericRow from './VoteNumericRow.svelte';

  type VoteOption = { id: string; label: string };

  let {
    options,
    numericRanks,
    rankError,
    onRankChange,
  }: {
    options: VoteOption[];
    numericRanks: string[];
    rankError: string | null;
    onRankChange: (index: number, value: string) => void;
  } = $props();
</script>

<ul class="option-list numeric-list" role="list">
  {#each options as opt, i (opt.id)}
    <VoteNumericRow
      label={opt.label}
      rank={i}
      value={numericRanks[i]}
      maxRank={options.length}
      onChange={(value) => onRankChange(i, value)}
    />
  {/each}
</ul>
{#if rankError}
  <p class="rank-error" role="alert">{rankError}</p>
{/if}

<style>
  .option-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .numeric-list {
    gap: var(--space-2);
  }

  .rank-error {
    margin: -28px 0 0;
    font-size: 14px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .rank-error {
    color: #f97066;
  }
</style>
