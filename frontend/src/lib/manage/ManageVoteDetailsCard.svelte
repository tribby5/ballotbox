<script lang="ts">
  import ManageShareLinkRow from './ManageShareLinkRow.svelte';
  import ManageVoteOptionsList from './ManageVoteOptionsList.svelte';
  import ManageVoteMethodSection from './ManageVoteMethodSection.svelte';
  import ManageVoteResultsSection from './ManageVoteResultsSection.svelte';

  let {
    shareUrl,
    copyStatus,
    onCopy,
    options,
    methodLabel,
    hasResponses,
    passwordProtected,
    resultsUrl,
  }: {
    shareUrl: string;
    copyStatus: 'idle' | 'copied' | 'error';
    onCopy: () => void;
    options: string[];
    methodLabel: string;
    hasResponses: boolean;
    passwordProtected: boolean;
    resultsUrl: string;
  } = $props();
</script>

<div class="manage-card bb-surface bb-surface--narrow">
  <ManageShareLinkRow {shareUrl} {copyStatus} {onCopy} />
  <ManageVoteOptionsList {options} />
  <ManageVoteMethodSection {methodLabel} />
  <ManageVoteResultsSection {hasResponses} {passwordProtected} {resultsUrl} />
</div>

<style>
  .manage-card {
    padding: 24px 25px 22px;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }
</style>
