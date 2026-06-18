<script lang="ts">
  let { options }: { options: string[] } = $props();
</script>

<section class="card-section bordered">
  <h3 class="section-title-sm">Options</h3>
  <ol class="options-list">
    {#each options as option, i (i)}
      <li>{option}</li>
    {/each}
  </ol>
</section>

<style>
  .card-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .card-section.bordered {
    border-top: 1px solid var(--border-subtle);
    padding-top: 17px;
  }

  .section-title-sm {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
  }

  .options-list {
    margin: 0;
    padding-left: 1.25rem;
    display: flex;
    flex-direction: column;
    gap: 4px;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }
</style>
