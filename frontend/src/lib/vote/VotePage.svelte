<script lang="ts">
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import type { VoteRow } from '$lib/vote/voteRecord';

  type OptionRow = { id: string; text: string };

  let { vote }: { vote: VoteRow } = $props();

  let mode = $state<'drag' | 'numeric'>('drag');
  let ordered = $state<OptionRow[]>([]);
  let numericRanks = $state<string[]>([]);
  let rankError = $state<string | null>(null);
  let dragFrom = $state<number | null>(null);

  $effect.pre(() => {
    ordered = vote.options.map((text, i) => ({
      id: `opt-${vote.public_id}-${i}`,
      text,
    }));
    numericRanks = vote.options.map(() => '');
    rankError = null;
    mode = 'drag';
  });

  function onDragStart(index: number) {
    dragFrom = index;
  }

  function onDragEnd() {
    dragFrom = null;
  }

  function onDragOver(ev: DragEvent) {
    ev.preventDefault();
  }

  function onDrop(toIndex: number) {
    if (dragFrom === null) return;
    const from = dragFrom;
    const next = [...ordered];
    const [item] = next.splice(from, 1);
    next.splice(toIndex, 0, item);
    ordered = next;
    dragFrom = null;
  }

  function parseRank(s: string): number | null {
    const n = parseInt(s.trim(), 10);
    if (!Number.isFinite(n) || String(n) !== s.trim()) return null;
    return n;
  }

  function submitDrag() {
    rankError = null;
    const order = ordered.map((o) => o.text);
    void persistBallot(order);
  }

  function submitNumeric() {
    rankError = null;
    const n = vote.options.length;
    const parsed = numericRanks.map(parseRank);
    if (parsed.some((p) => p === null)) {
      rankError = 'Enter a whole number rank for every option.';
      return;
    }
    const ranks = parsed as number[];
    if (ranks.some((r) => r < 1 || r > n)) {
      rankError = `Each rank must be between 1 and ${n}.`;
      return;
    }
    const seen = new Set(ranks);
    if (seen.size !== ranks.length) {
      rankError = 'Ranks must be unique.';
      return;
    }
    const order = [...vote.options]
      .map((text, i) => ({ text, r: ranks[i] }))
      .sort((a, b) => a.r - b.r)
      .map((x) => x.text);
    void persistBallot(order);
  }

  async function persistBallot(order: string[]) {
    void order;
    // Replace with Supabase insert when API exists
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner">
    <header class="bb-page-head bb-page-head--narrow">
      <h1 class="bb-page-title">{vote.title}</h1>
      <p class="bb-page-sub">Rank the options from most to least preferred</p>
    </header>

    <div class="mode-switch" role="tablist" aria-label="Ranking mode">
      <button
        type="button"
        class="mode-btn"
        class:mode-btn-active={mode === 'drag'}
        role="tab"
        aria-selected={mode === 'drag'}
        tabindex={mode === 'drag' ? 0 : -1}
        onclick={() => {
          mode = 'drag';
          rankError = null;
        }}
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
        onclick={() => {
          mode = 'numeric';
          rankError = null;
        }}
      >
        Number Input
      </button>
    </div>

    <div class="vote-card bb-surface bb-surface--padded bb-surface--medium bb-surface--gap-loose">
      {#if mode === 'drag'}
        <ul class="option-list" role="list">
          {#each ordered as row, i (row.id)}
            <li
              class="dnd-row"
              draggable="true"
              role="listitem"
              ondragstart={() => onDragStart(i)}
              ondragend={onDragEnd}
              ondragover={onDragOver}
              ondrop={() => onDrop(i)}
            >
              <span class="drag-handle" aria-hidden="true">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="5" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="5" r="1.5" fill="currentColor" />
                  <circle cx="5" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="10" r="1.5" fill="currentColor" />
                  <circle cx="5" cy="15" r="1.5" fill="currentColor" />
                  <circle cx="10" cy="15" r="1.5" fill="currentColor" />
                </svg>
              </span>
              <div class="dnd-text">
                <span class="rank-label">#{i + 1}</span>
                <span class="option-label">{row.text}</span>
              </div>
            </li>
          {/each}
        </ul>
      {:else}
        <ul class="option-list numeric-list" role="list">
          {#each vote.options as opt, i (i)}
            <li class="numeric-row">
              <span class="option-label-static">{opt}</span>
              <label class="sr-only" for="rank-{i}">Rank for {opt}</label>
              <input
                id="rank-{i}"
                class="bb-input bb-input--narrow"
                type="text"
                inputmode="numeric"
                autocomplete="off"
                placeholder="1–{vote.options.length}"
                value={numericRanks[i]}
                oninput={(e) => {
                  const next = [...numericRanks];
                  next[i] = e.currentTarget.value;
                  numericRanks = next;
                }}
              />
            </li>
          {/each}
        </ul>
        {#if rankError}
          <p class="rank-error" role="alert">{rankError}</p>
        {/if}
      {/if}

      <button
        class="bb-btn-primary-lg"
        type="button"
        onclick={mode === 'drag' ? submitDrag : submitNumeric}
      >
        Submit Vote
      </button>
    </div>
  </div>
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

  .vote-card {
    display: flex;
    flex-direction: column;
  }

  .option-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .dnd-row {
    display: flex;
    align-items: center;
    gap: 12px;
    min-height: 58px;
    padding: 17px;
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
    cursor: grab;
  }

  .dnd-row:active {
    cursor: grabbing;
  }

  .drag-handle {
    flex-shrink: 0;
    display: inline-flex;
    color: var(--text-muted);
  }

  .dnd-text {
    flex: 1;
    min-width: 0;
    display: flex;
    align-items: baseline;
    gap: 10px;
  }

  .rank-label {
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .option-label {
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .numeric-list {
    gap: var(--space-2);
  }

  .numeric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: 12px var(--space-2);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .option-label-static {
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .rank-error {
    margin: -28px 0 0;
    font-size: 14px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .rank-error {
    color: #f97066;
  }
</style>
