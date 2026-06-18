<script lang="ts">
  import MethodsDocIcon from './MethodsDocIcon.svelte';

  let { current = false }: { current?: boolean } = $props();
</script>

{#if current}
  <span class="nav-link nav-link-current" aria-current="page">
    <span class="nav-icon" aria-hidden="true"><MethodsDocIcon /></span>
    Voting Methods
  </span>
{:else}
  <a class="nav-link" href="/methods">
    <span class="nav-icon" aria-hidden="true"><MethodsDocIcon /></span>
    Voting Methods
  </a>
{/if}

<style>
  .nav-link {
    display: inline-flex;
    align-items: center;
    gap: var(--space-1);
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
  }

  .nav-link:hover {
    color: var(--accent);
  }

  .nav-icon {
    display: inline-flex;
    color: var(--text-muted);
  }

  .nav-link:hover .nav-icon {
    color: var(--accent);
  }

  .nav-link-current {
    cursor: default;
    color: var(--accent);
  }

  .nav-link-current .nav-icon {
    color: var(--accent);
  }
</style>
