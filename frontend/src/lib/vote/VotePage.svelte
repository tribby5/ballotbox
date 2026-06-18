<script lang="ts">
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import type { VoteRow } from '$lib/vote/voteRecord';
  import VoteModeTabs from './VoteModeTabs.svelte';
  import VoteRankingCard from './VoteRankingCard.svelte';
  import { reorderDragged, type OptionRow } from './votePage.ranking';
  import { persistVoteBallot, submitDragOrder, submitNumericOrder } from './votePage.submit';

  let { vote }: { vote: VoteRow } = $props();

  let mode = $state<'drag' | 'numeric'>('drag');
  let ordered = $state<OptionRow[]>([]);
  let numericRanks = $state<string[]>([]);
  let rankError = $state<string | null>(null);
  let dragFrom = $state<number | null>(null);
  let submitError = $state<string | null>(null);
  let submitting = $state(false);
  let submittedProtected = $state(false);

  const votingClosed = $derived(!!vote.locked_at);
  const submitLabel = $derived(
    submitting ? 'Submitting…' : votingClosed ? 'Voting closed' : 'Submit Vote',
  );

  $effect.pre(() => {
    ordered = vote.options.map((o) => ({ id: o.id, text: o.label }));
    numericRanks = vote.options.map(() => '');
    rankError = null;
    submitError = null;
    mode = 'drag';
  });

  function selectMode(next: 'drag' | 'numeric') {
    mode = next;
    rankError = null;
  }

  function onDrop(toIndex: number) {
    if (dragFrom === null) return;
    ordered = reorderDragged(ordered, dragFrom, toIndex);
    dragFrom = null;
  }

  async function handleSubmit() {
    const orderIds =
      mode === 'drag'
        ? submitDragOrder(ordered)
        : (() => {
            const result = submitNumericOrder(numericRanks, vote.options);
            if ('error' in result) {
              rankError = result.error;
              return null;
            }
            rankError = null;
            return result.orderIds;
          })();
    if (!orderIds) return;
    submitting = true;
    const outcome = await persistVoteBallot(vote, orderIds);
    submitError = outcome.submitError;
    submittedProtected = outcome.submittedProtected;
    submitting = false;
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner">
    <header class="bb-page-head bb-page-head--narrow">
      <h1 class="bb-page-title">{vote.title}</h1>
      <p class="bb-page-sub">Rank the options from most to least preferred</p>
    </header>

    <VoteModeTabs {mode} onSelect={selectMode} />

    <VoteRankingCard
      {mode}
      {vote}
      {ordered}
      {numericRanks}
      {rankError}
      {submitError}
      {submittedProtected}
      {submitting}
      {votingClosed}
      {submitLabel}
      onDragStart={(index) => {
        dragFrom = index;
      }}
      onDragEnd={() => {
        dragFrom = null;
      }}
      onDragOver={(ev) => ev.preventDefault()}
      {onDrop}
      onRankChange={(index, value) => {
        const next = [...numericRanks];
        next[index] = value;
        numericRanks = next;
      }}
      onSubmit={() => void handleSubmit()}
    />
  </div>
</div>
