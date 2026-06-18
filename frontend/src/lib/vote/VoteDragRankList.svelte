<script lang="ts">
  import VoteDragRow from './VoteDragRow.svelte';

  type OptionRow = { id: string; text: string };

  let {
    ordered,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDrop,
  }: {
    ordered: OptionRow[];
    onDragStart: (index: number) => void;
    onDragEnd: () => void;
    onDragOver: (ev: DragEvent) => void;
    onDrop: (index: number) => void;
  } = $props();
</script>

<ul class="option-list" role="list">
  {#each ordered as row, i (row.id)}
    <VoteDragRow
      rank={i + 1}
      text={row.text}
      onDragStart={() => onDragStart(i)}
      {onDragEnd}
      {onDragOver}
      onDrop={() => onDrop(i)}
    />
  {/each}
</ul>

<style>
  .option-list {
    list-style: none;
    margin: 0;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }
</style>
