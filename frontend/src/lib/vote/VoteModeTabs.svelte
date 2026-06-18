<script lang="ts">
  let {
    mode,
    onSelect,
  }: {
    mode: 'drag' | 'numeric';
    onSelect: (mode: 'drag' | 'numeric') => void;
  } = $props();
</script>

<div class="mode-switch" role="tablist" aria-label="Ranking mode">
  <button
    type="button"
    class="mode-btn"
    class:mode-btn-active={mode === 'drag'}
    role="tab"
    aria-selected={mode === 'drag'}
    tabindex={mode === 'drag' ? 0 : -1}
    onclick={() => onSelect('drag')}
  >
    Drag &amp; Drop
  </button>
  <button
    type="button"
    class="mode-btn"
    class:mode-btn-active={mode === 'numeric'}
    role="tab"
    aria-selected={mode === 'numeric'}
    tabindex={mode === 'numeric' ? 0 : -1}
    onclick={() => onSelect('numeric')}
  >
    Number Input
  </button>
</div>

<style>
  .mode-switch {
    display: inline-flex;
    gap: var(--space-1);
    padding: 4px;
    border-radius: var(--radius-md);
    background: var(--bg-share-url);
    max-width: max-content;
  }

  .mode-btn {
    height: 40px;
    min-width: 7.5rem;
    padding: 0 var(--space-2);
    border: none;
    border-radius: 10px;
    background: transparent;
    font-family: var(--font-sans);
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
    color: var(--text-primary);
    cursor: pointer;
  }

  .mode-btn-active {
    background: var(--bg-card);
    box-shadow: var(--shadow-card);
  }

  .mode-btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }
</style>
