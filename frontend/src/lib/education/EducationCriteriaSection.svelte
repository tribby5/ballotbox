<script lang="ts">
  import type { CriterionBlock } from './educationContent';

  let { blocks }: { blocks: CriterionBlock[] } = $props();
</script>

<section class="bb-surface bb-surface--padded criteria-card">
  <h2 class="card-title-lg">Key Voting Criteria</h2>
  <div class="criteria-stack">
    {#each blocks as c (c.title)}
      <div class="criterion">
        <h3 class="criterion-title">{c.title}</h3>
        <p class="body-text-sm">{c.body}</p>
      </div>
    {/each}
  </div>
</section>

<style>
  .criteria-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card-title-lg {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 24px;
    line-height: 32px;
    color: var(--text-primary);
  }

  .criteria-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .criterion-title {
    margin: 0 0 2px;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .body-text-sm {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
