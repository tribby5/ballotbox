<script lang="ts">
  let {
    hasResponses,
    passwordProtected,
    resultsUrl,
  }: {
    hasResponses: boolean;
    passwordProtected: boolean;
    resultsUrl: string;
  } = $props();
</script>

{#if hasResponses}
  <section class="card-section bordered">
    <h3 class="section-title-sm">Results</h3>
    <p class="results-hint">
      <a class="bb-link-accent" href={resultsUrl}>View results</a>
      {#if passwordProtected}
        (password required)
      {/if}
    </p>
  </section>
{:else}
  <section class="card-section bordered footnote">
    <p class="footnote-text">
      Results will be available after the first response is submitted.
    </p>
  </section>
{/if}

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

  .card-section.footnote {
    padding-top: 16px;
    margin-top: -4px;
  }

  .section-title-sm {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
  }

  .footnote-text,
  .results-hint {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
