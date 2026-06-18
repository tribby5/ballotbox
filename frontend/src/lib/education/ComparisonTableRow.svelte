<script lang="ts">
  import CriterionYesNoIcon from './CriterionYesNoIcon.svelte';
  import type { ComparisonRow } from './educationContent';

  let { row }: { row: ComparisonRow } = $props();
</script>

<tr>
  <th scope="row" class="method-cell">{row.method}</th>
  <td class="icon-cell"><CriterionYesNoIcon yes={row.universality} /></td>
  <td class="icon-cell"><CriterionYesNoIcon yes={row.monotonicity} /></td>
  <td class="icon-cell"><CriterionYesNoIcon yes={row.condorcet} /></td>
  <td class="icon-cell"><CriterionYesNoIcon yes={row.iia} /></td>
</tr>

<style>
  .method-cell {
    text-align: left;
    padding-left: 16px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .icon-cell {
    text-align: center;
  }
</style>
