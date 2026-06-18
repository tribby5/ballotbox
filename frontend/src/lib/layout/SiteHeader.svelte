<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import HeaderMethodsNav from './HeaderMethodsNav.svelte';
  import ThemeToggleButton from './ThemeToggleButton.svelte';

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
      <HeaderMethodsNav current={methodsPage} />
      <ThemeToggleButton {theme} onToggle={toggleTheme} />
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
</style>
