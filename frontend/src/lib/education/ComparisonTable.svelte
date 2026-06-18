<script lang="ts">
  import ComparisonTableRow from './ComparisonTableRow.svelte';
  import type { ComparisonRow } from './educationContent';
  import './education.css';

  let { rows }: { rows: ComparisonRow[] } = $props();
</script>

<div class="comparison-table-wrap">
  <table class="comparison-table">
    <thead>
      <tr>
        <th scope="col">Method</th>
        <th scope="col">Universality</th>
        <th scope="col">Monotonicity</th>
        <th scope="col">Condorcet</th>
        <th scope="col">IIA</th>
      </tr>
    </thead>
    <tbody>
      {#each rows as row (row.method)}
        <ComparisonTableRow {row} />
      {/each}
    </tbody>
  </table>
</div>
