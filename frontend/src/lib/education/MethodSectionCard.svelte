<script lang="ts">
  import type { MethodSection } from './educationContent';

  let { section }: { section: MethodSection } = $props();
</script>

<article class="bb-surface bb-surface--padded method-card">
  <h3 class="card-title-md">{section.title}</h3>
  <p class="body-text lead">{section.lead}</p>
  <div class="detail-stack">
    <div class="detail-block">
      <h4 class="card-title-sm">How it works:</h4>
      <p class="body-text-sm">{section.howItWorks}</p>
    </div>
    <div class="detail-block">
      <h4 class="card-title-sm">Pros:</h4>
      <p class="body-text-sm">{section.pros}</p>
    </div>
    <div class="detail-block">
      <h4 class="card-title-sm">Cons:</h4>
      <p class="body-text-sm">{section.cons}</p>
    </div>
  </div>
</article>

<style>
  .method-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .method-card .lead {
    margin-top: -4px;
  }

  .card-title-md {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: var(--text-primary);
  }

  .card-title-sm {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
  }

  .body-text {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-muted);
  }

  .body-text-sm {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .detail-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .detail-block {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
</style>
