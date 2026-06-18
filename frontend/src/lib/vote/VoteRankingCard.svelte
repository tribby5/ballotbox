<script lang="ts">
  import VoteDragRankList from './VoteDragRankList.svelte';
  import VoteNumericRankList from './VoteNumericRankList.svelte';
  import VoteSubmitSection from './VoteSubmitSection.svelte';
  import type { VoteRow } from './voteRecord';

  type OptionRow = { id: string; text: string };

  let {
    mode,
    vote,
    ordered,
    numericRanks,
    rankError,
    submitError,
    submittedProtected,
    submitting,
    votingClosed,
    submitLabel,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
    onRankChange,
    onSubmit,
  }: {
    mode: 'drag' | 'numeric';
    vote: VoteRow;
    ordered: OptionRow[];
    numericRanks: string[];
    rankError: string | null;
    submitError: string | null;
    submittedProtected: boolean;
    submitting: boolean;
    votingClosed: boolean;
    submitLabel: string;
    onDragStart: (index: number) => void;
    onDragEnd: () => void;
    onDragOver: (ev: DragEvent) => void;
    onDrop: (index: number) => void;
    onRankChange: (index: number, value: string) => void;
    onSubmit: () => void;
  } = $props();
</script>

<div class="vote-card bb-surface bb-surface--padded bb-surface--medium bb-surface--gap-loose">
  {#if mode === 'drag'}
    <VoteDragRankList {ordered} {onDragStart} {onDragEnd} {onDragOver} {onDrop} />
  {:else}
    <VoteNumericRankList
      options={vote.options}
      {numericRanks}
      {rankError}
      {onRankChange}
    />
  {/if}

  <VoteSubmitSection
    {submitError}
    {submittedProtected}
    {submitting}
    {votingClosed}
    {submitLabel}
    {onSubmit}
  />
</div>

<style>
  .vote-card {
    display: flex;
    flex-direction: column;
  }
</style>
