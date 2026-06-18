<script lang="ts">
  let {
    title,
    bullets,
  }: {
    title: string;
    bullets: readonly string[];
  } = $props();
</script>

<section class="further-reading">
  <h2 class="card-title-md">{title}</h2>
  <ul class="further-list">
    {#each bullets as line (line)}
      <li class="further-item">{line}</li>
    {/each}
  </ul>
</section>

<style>
  .card-title-md {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 20px;
    line-height: 28px;
    color: var(--text-primary);
  }

  .further-reading {
    padding: 24px 25px 25px;
    border-radius: var(--radius-lg);
    border: 1px solid color-mix(in srgb, var(--accent) 28%, transparent);
    background: color-mix(in srgb, var(--accent) 10%, transparent);
    display: flex;
    flex-direction: column;
    gap: 12px;
  }

  .further-list {
    margin: 0;
    padding: 0 0 0 1.1rem;
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .further-item {
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
