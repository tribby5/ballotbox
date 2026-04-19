<script lang="ts">
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import {
    heroTitle,
    heroSubtitle,
    introTitle,
    introParagraphs,
    methodSections,
    criteriaBlocks,
    comparisonRows,
    furtherReadingTitle,
    furtherReadingBullets,
  } from '$lib/education/educationContent';
</script>

<SiteHeader methodsPage />

<div class="bb-page">
  <div class="bb-page-inner bb-page-inner--education">
    <header class="hero">
      <h1 class="hero-title">{heroTitle}</h1>
      <p class="hero-sub">{heroSubtitle}</p>
    </header>

    <section class="bb-surface bb-surface--padded intro-card">
      <h2 class="card-title-lg">{introTitle}</h2>
      {#each introParagraphs as para (para)}
        <p class="body-text">{para}</p>
      {/each}
    </section>

    <div class="method-stack">
      {#each methodSections as m (m.title)}
        <article class="bb-surface bb-surface--padded method-card">
          <h3 class="card-title-md">{m.title}</h3>
          <p class="body-text lead">{m.lead}</p>
          <div class="detail-stack">
            <div class="detail-block">
              <h4 class="card-title-sm">How it works:</h4>
              <p class="body-text-sm">{m.howItWorks}</p>
            </div>
            <div class="detail-block">
              <h4 class="card-title-sm">Pros:</h4>
              <p class="body-text-sm">{m.pros}</p>
            </div>
            <div class="detail-block">
              <h4 class="card-title-sm">Cons:</h4>
              <p class="body-text-sm">{m.cons}</p>
            </div>
          </div>
        </article>
      {/each}
    </div>

    <section class="bb-surface bb-surface--padded criteria-card">
      <h2 class="card-title-lg">Key Voting Criteria</h2>
      <div class="criteria-stack">
        {#each criteriaBlocks as c (c.title)}
          <div class="criterion">
            <h3 class="criterion-title">{c.title}</h3>
            <p class="body-text-sm">{c.body}</p>
          </div>
        {/each}
      </div>
    </section>

    <div class="table-wrap">
      <table class="compare-table">
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
          {#each comparisonRows as row (row.method)}
            <tr>
              <th scope="row" class="method-cell">{row.method}</th>
              <td class="icon-cell">
                {#if row.universality}
                  <span class="icon-yes" aria-label="Yes" title="Yes">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <circle cx="10" cy="10" r="9" stroke="var(--accent)" stroke-width="1.4" />
                      <path
                        d="M6 10.2 8.7 13 14 7.5"
                        stroke="var(--accent)"
                        stroke-width="1.6"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  </span>
                {:else}
                  <span class="icon-no" aria-label="No" title="No">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path
                        d="M6 6l8 8M14 6 6 14"
                        stroke="currentColor"
                        stroke-width="1.6"
                        stroke-linecap="round"
                      />
                    </svg>
                  </span>
                {/if}
              </td>
              <td class="icon-cell">{#if row.monotonicity}<span class="icon-yes" aria-label="Yes"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--accent)" stroke-width="1.4" /><path d="M6 10.2 8.7 13 14 7.5" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{:else}<span class="icon-no" aria-label="No"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6 6 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg></span>{/if}</td>
              <td class="icon-cell">{#if row.condorcet}<span class="icon-yes" aria-label="Yes"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--accent)" stroke-width="1.4" /><path d="M6 10.2 8.7 13 14 7.5" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{:else}<span class="icon-no" aria-label="No"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6 6 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg></span>{/if}</td>
              <td class="icon-cell">{#if row.iia}<span class="icon-yes" aria-label="Yes"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><circle cx="10" cy="10" r="9" stroke="var(--accent)" stroke-width="1.4" /><path d="M6 10.2 8.7 13 14 7.5" stroke="var(--accent)" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" /></svg></span>{:else}<span class="icon-no" aria-label="No"><svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M6 6l8 8M14 6 6 14" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" /></svg></span>{/if}</td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>

    <section class="further-reading">
      <h2 class="card-title-md">{furtherReadingTitle}</h2>
      <ul class="further-list">
        {#each furtherReadingBullets as line (line)}
          <li class="further-item">{line}</li>
        {/each}
      </ul>
    </section>
  </div>
</div>

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

  .method-stack {
    display: flex;
    flex-direction: column;
    gap: 32px;
  }

  .method-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .method-card .lead {
    margin-top: -4px;
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

  .criteria-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
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

  .table-wrap {
    width: 100%;
    overflow-x: auto;
    border-radius: var(--radius-lg);
    border: 1px solid var(--border-subtle);
    background: var(--bg-card);
    box-shadow: var(--shadow-card);
  }

  .compare-table {
    width: 100%;
    min-width: 640px;
    border-collapse: collapse;
    font-size: 16px;
    line-height: 24px;
  }

  .compare-table thead th {
    padding: 16px 12px;
    text-align: center;
    font-family: var(--font-serif);
    font-weight: 700;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
    background: var(--bg-share-url);
    border-bottom: 1px solid var(--border-subtle);
  }

  .compare-table thead th:first-child {
    text-align: left;
    padding-left: 16px;
  }

  .compare-table tbody tr {
    border-top: 1px solid var(--border-subtle);
  }

  .compare-table tbody th,
  .compare-table tbody td {
    padding: 14px 12px;
    vertical-align: middle;
  }

  .method-cell {
    text-align: left;
    padding-left: 16px;
    font-weight: 400;
    color: var(--text-primary);
  }

  .icon-cell {
    text-align: center;
  }

  .icon-yes,
  .icon-no {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  .icon-no {
    color: var(--text-muted);
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
