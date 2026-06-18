<script lang="ts">
  let {
    rank,
    text,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  }: {
    rank: number;
    text: string;
    onDragStart: () => void;
    onDragEnd: () => void;
    onDragOver: (ev: DragEvent) => void;
    onDrop: () => void;
  } = $props();
</script>

<li
  class="dnd-row"
  draggable="true"
  role="listitem"
  ondragstart={onDragStart}
  ondragend={onDragEnd}
  ondragover={onDragOver}
  ondrop={onDrop}
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
    <span class="rank-label">#{rank}</span>
    <span class="option-label">{text}</span>
  </div>
</li>

<style>
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
</style>
