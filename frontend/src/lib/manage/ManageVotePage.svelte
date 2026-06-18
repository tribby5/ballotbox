<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import ManageVotePageHeader from './ManageVotePageHeader.svelte';
  import ManageVoteDetailsCard from './ManageVoteDetailsCard.svelte';
  import { copyTextToClipboard, loadManageVote, manageVoteUrls } from './manageVotePage.load';

  let { voteId }: { voteId: string } = $props();

  let loaded = $state(false);
  let loadError = $state<string | null>(null);
  let title = $state('');
  let options = $state<string[]>([]);
  let methodLabel = $state('');
  let hasResponses = $state(false);
  let passwordProtected = $state(false);
  let shareUrl = $state('');
  let resultsUrl = $state('');
  let copyStatus = $state<'idle' | 'copied' | 'error'>('idle');

  onMount(() => {
    ({ shareUrl, resultsUrl } = manageVoteUrls(voteId));
    void loadManageVote(voteId).then((view) => {
      loaded = view.loaded;
      loadError = view.loadError;
      title = view.title;
      options = view.options;
      methodLabel = view.methodLabel;
      hasResponses = view.hasResponses;
      passwordProtected = view.passwordProtected;
    });
  });

  async function copyShareLink() {
    if (!browser || !shareUrl) return;
    try {
      await copyTextToClipboard(shareUrl);
      copyStatus = 'copied';
    } catch {
      copyStatus = 'error';
    }
    setTimeout(() => {
      copyStatus = 'idle';
    }, 2000);
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner">
    <ManageVotePageHeader
      {loadError}
      {loaded}
      {title}
      {voteId}
      {hasResponses}
      {passwordProtected}
    />
    {#if loaded && !loadError}
      <ManageVoteDetailsCard
        {shareUrl}
        {copyStatus}
        onCopy={copyShareLink}
        {options}
        {methodLabel}
        {hasResponses}
        {passwordProtected}
        {resultsUrl}
      />
    {/if}
  </div>
</div>
