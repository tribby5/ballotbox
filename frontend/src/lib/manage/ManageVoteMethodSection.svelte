<script lang="ts">
  let { methodLabel }: { methodLabel: string } = $props();
</script>

<section class="card-section bordered">
  <h3 class="section-title-sm">Voting Method</h3>
  <p class="method-value">{methodLabel}</p>
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

  .method-value {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }
</style>
