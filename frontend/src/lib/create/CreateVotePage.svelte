<script lang="ts">
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import CreateVoteOptionsSection from './CreateVoteOptionsSection.svelte';
  import CreateVoteSettingsSection from './CreateVoteSettingsSection.svelte';
  import { finalizeCreateVote, randomVoteId } from './createVotePage.submit';
  import type { VotingMethodValue } from '$lib/votingMethods';

  let voteId = $state('');
  let title = $state('');
  let options = $state(['', '']);
  let method = $state<VotingMethodValue>('ranked_pairs');
  let password = $state('');
  let saving = $state(false);
  let saveError = $state<string | null>(null);

  onMount(() => {
    voteId = randomVoteId();
  });

  function addOption() {
    if (options.length >= 30) return;
    options = [...options, ''];
  }

  async function finalizeVote() {
    saveError = null;
    saving = true;
    saveError = await finalizeCreateVote({ voteId, title, options, method, password });
    saving = false;
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner create-page-inner">
    <header class="bb-page-head">
      <h1 class="bb-page-title">Create Vote</h1>
      <p class="bb-page-sub">Vote ID: {voteId || '…'}</p>
    </header>

    <div class="bb-surface bb-surface--padded bb-surface--narrow bb-surface--stack">
      <CreateVoteOptionsSection bind:title bind:options onAddOption={addOption} />
      <CreateVoteSettingsSection
        bind:method
        bind:password
        {saveError}
        {saving}
        onFinalize={() => void finalizeVote()}
      />
    </div>
  </div>
</div>

<style>
  .create-page-inner {
    align-items: center;
  }

  .create-page-inner > :is(.bb-page-head, .bb-surface) {
    width: 100%;
    max-width: 39.5rem;
  }
</style>
