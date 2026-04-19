<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';

  const THEME_KEY = 'ballotbox-theme';

  let { methodsPage = false }: { methodsPage?: boolean } = $props();

  let theme = $state<'light' | 'dark'>('light');

  function applyTheme(next: 'light' | 'dark') {
    if (!browser) return;
    document.documentElement.dataset.theme = next;
    localStorage.setItem(THEME_KEY, next);
  }

  function toggleTheme() {
    theme = theme === 'light' ? 'dark' : 'light';
    applyTheme(theme);
  }

  onMount(() => {
    const stored = localStorage.getItem(THEME_KEY);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    if (stored === 'light' || stored === 'dark') {
      theme = stored;
    } else {
      theme = prefersDark ? 'dark' : 'light';
    }
    applyTheme(theme);
  });
</script>

<header class="header">
  <div class="header-inner">
    <a class="logo" href="/">Ballot Box</a>
    <div class="header-actions">
      {#if methodsPage}
        <span class="nav-link nav-link-current" aria-current="page">
          <span class="nav-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 2.5h4v11H3v-11Zm6 0h4v11H9v-11Z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Voting Methods
        </span>
      {:else}
        <a class="nav-link" href="/methods">
          <span class="nav-icon" aria-hidden="true">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 2.5h4v11H3v-11Zm6 0h4v11H9v-11Z"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linejoin="round"
              />
            </svg>
          </span>
          Voting Methods
        </a>
      {/if}
      <button
        class="theme-toggle"
        type="button"
        aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
        onclick={toggleTheme}
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
    </div>
  </div>
</header>

<style>
  .header {
    border-bottom: 1px solid var(--border-subtle);
    background: var(--bg-page);
  }

  .header-inner {
    max-width: 1100px;
    margin: 0 auto;
    padding: var(--space-2) clamp(var(--space-2), 4vw, 40px);
    display: flex;
    align-items: center;
    justify-content: space-between;
    min-height: 68px;
  }

  .logo {
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: var(--accent);
  }

  .header-actions {
    display: flex;
    align-items: center;
    gap: var(--space-2);
  }

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
