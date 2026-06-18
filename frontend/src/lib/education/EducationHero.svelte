<script lang="ts">
  let { title, subtitle }: { title: string; subtitle: string } = $props();
</script>

<header class="hero">
  <h1 class="hero-title">{title}</h1>
  <p class="hero-sub">{subtitle}</p>
</header>

<style>
  .hero {
    text-align: center;
    max-width: 56rem;
    margin: 0 auto;
  }

  .hero-title {
    margin: 0 0 var(--space-2);
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: clamp(28px, 4vw, 36px);
    line-height: 40px;
    color: var(--text-primary);
  }

  .hero-sub {
    margin: 0 auto;
    max-width: 42rem;
    font-size: 18px;
    line-height: 28px;
    color: var(--text-muted);
  }
</style>
