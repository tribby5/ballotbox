<script lang="ts">
  let { yes }: { yes: boolean } = $props();
</script>

{#if yes}
  <span class="icon-yes" aria-label="Yes" title="Yes">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <circle cx="10" cy="10" r="9" stroke="var(--accent)" stroke-width="1.4" />
      <path
        d="M6 10.2 8.7 13 14 7.5"
        stroke="var(--accent)"
        stroke-width="1.6"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  </span>
{:else}
  <span class="icon-no" aria-label="No" title="No">
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <path
        d="M6 6l8 8M14 6 6 14"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  </span>
{/if}

<style>
  .icon-yes,
  .icon-no {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon-no {
    color: var(--text-muted);
  }
</style>
