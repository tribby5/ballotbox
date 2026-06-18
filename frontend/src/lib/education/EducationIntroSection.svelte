<script lang="ts">
  let {
    title,
    paragraphs,
  }: {
    title: string;
    paragraphs: readonly string[];
  } = $props();
</script>

<section class="bb-surface bb-surface--padded intro-card">
  <h2 class="card-title-lg">{title}</h2>
  {#each paragraphs as para (para)}
    <p class="body-text">{para}</p>
  {/each}
</section>

<style>
  .intro-card {
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

  .body-text {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-muted);
  }
</style>
