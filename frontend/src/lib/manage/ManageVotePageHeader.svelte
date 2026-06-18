<script lang="ts">
  let {
    loadError,
    loaded,
    title,
    voteId,
    hasResponses,
    passwordProtected,
  }: {
    loadError: string | null;
    loaded: boolean;
    title: string;
    voteId: string;
    hasResponses: boolean;
    passwordProtected: boolean;
  } = $props();
</script>

<header class="bb-page-head">
  {#if loadError}
    <p class="load-error" role="alert">{loadError}</p>
  {:else if !loaded}
    <p class="load-hint">Loading vote…</p>
  {:else}
    <h1 class="bb-page-title">{title}</h1>
  {/if}
  <p class="bb-page-sub">Vote ID: {voteId}</p>
  {#if loaded && !loadError}
    <p class="status-line" role="status">
      {#if hasResponses}
        This vote has responses and is closed to new ballots.
      {:else}
        Waiting for the first response. Votes cannot be edited after creation.
      {/if}
      {#if passwordProtected}
        Results require the vote password.
      {/if}
    </p>
  {/if}
</header>

<style>
  .status-line {
    margin: 8px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .load-hint,
  .load-error {
    margin: 0;
    font-size: 18px;
    line-height: 26px;
    color: var(--text-primary);
  }

  .load-error {
    color: #b42318;
  }

  :global(html[data-theme='dark']) .load-error {
    color: #f97066;
  }
</style>
