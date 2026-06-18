<script lang="ts">
  let {
    loading,
    loadError,
  }: {
    loading: boolean;
    loadError: string | null;
  } = $props();
</script>

{#if loading}
  <p class="load-hint">Loading results…</p>
{:else if loadError}
  <p class="load-error" role="alert">{loadError}</p>
{/if}

<style>
  .load-hint {
    margin: 0;
    font-size: 16px;
    color: var(--text-muted);
  }

  .load-error {
    margin: 0;
    font-size: 16px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .load-error {
    color: #f97066;
  }
</style>
