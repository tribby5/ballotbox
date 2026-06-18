<script lang="ts">
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import ResultsPasswordGate from './ResultsPasswordGate.svelte';
  import ResultsSummaryView from './ResultsSummaryView.svelte';
  import ResultsLoadingState from './ResultsLoadingState.svelte';
  import {
    applyResultsLoadState,
    emptyResultsView,
    fetchResultsView,
    resultsMethodLabel,
    resultsVoteCountLine,
    type ResultsViewState,
  } from './resultsPage.view';

  let { voteId }: { voteId: string } = $props();

  let view = $state<ResultsViewState>(emptyResultsView());
  let password = $state('');
  let checkingPassword = $state(false);

  onMount(() => {
    void fetchResultsView(voteId).then((state) => {
      view = applyResultsLoadState(state, view);
    });
  });

  async function submitPassword() {
    if (checkingPassword) return;
    checkingPassword = true;
    view = { ...view, loading: true };
    view = applyResultsLoadState(await fetchResultsView(voteId, password), view);
    checkingPassword = false;
  }

  const methodLabel = $derived(resultsMethodLabel(view.summary));
  const voteCountLine = $derived(resultsVoteCountLine(view.summary));
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner bb-page-inner--results">
    <ResultsLoadingState loading={view.loading} loadError={view.loadError} />
    {#if !view.loading && !view.loadError && view.needsPassword}
      <ResultsPasswordGate
        {voteId}
        bind:password
        passwordError={view.passwordError}
        {checkingPassword}
        onSubmit={() => void submitPassword()}
      />
    {:else if !view.loading && !view.loadError && view.summary}
      <ResultsSummaryView summary={view.summary} {methodLabel} {voteCountLine} />
    {/if}
  </div>
</div>
