<script lang="ts">
  let {
    theme,
    onToggle,
  }: {
    theme: 'light' | 'dark';
    onToggle: () => void;
  } = $props();
</script>

<button
  class="theme-toggle"
  type="button"
  aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
  onclick={onToggle}
>
  {#if theme === 'dark'}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="4" stroke="currentColor" stroke-width="1.6" />
      <path
        d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linecap="round"
      />
    </svg>
  {:else}
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M21 14.5A8.5 8.5 0 0 1 9.5 3 8.5 8.5 0 1 0 21 14.5Z"
        stroke="currentColor"
        stroke-width="1.6"
        stroke-linejoin="round"
      />
    </svg>
  {/if}
</button>

<style>
  .theme-toggle {
    width: 36px;
    height: 36px;
    border-radius: var(--radius-md);
    border: none;
    padding: 0;
    display: grid;
    place-items: center;
    background: transparent;
    color: var(--text-primary);
  }

  .theme-toggle:hover {
    background: var(--bg-muted);
  }

  .theme-toggle:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
</style>
