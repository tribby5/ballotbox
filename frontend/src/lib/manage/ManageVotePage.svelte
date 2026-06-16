<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import { fetchVoteByPublicId } from '$lib/vote/voteRecord';
  import { VOTING_METHODS } from '$lib/votingMethods';

  let { voteId }: { voteId: string } = $props();

  let loaded = $state(false);
  let loadError = $state<string | null>(null);
  let title = $state('');
  let options = $state<string[]>([]);
  let methodLabel = $state('');
  let hasResponses = $state(false);
  let passwordProtected = $state(false);

  let shareUrl = $state('');
  let resultsUrl = $state('');
  let copyStatus = $state<'idle' | 'copied' | 'error'>('idle');

  onMount(() => {
    if (browser) {
      shareUrl = `${window.location.origin}/vote/${encodeURIComponent(voteId)}`;
      resultsUrl = `${window.location.origin}/results/${encodeURIComponent(voteId)}`;
    } else {
      shareUrl = `/vote/${encodeURIComponent(voteId)}`;
      resultsUrl = `/results/${encodeURIComponent(voteId)}`;
    }

    void (async () => {
      const row = await fetchVoteByPublicId(voteId);
      if (!row) {
        loadError = 'Vote not found, or Supabase is not configured.';
        loaded = true;
        return;
      }
      title = row.title;
      options = row.options.map((o) => o.label);
      methodLabel = VOTING_METHODS.find((m) => m.value === row.voting_method)?.label ?? row.voting_method;
      hasResponses = !!row.locked_at;
      passwordProtected = row.password_protected;
      loaded = true;
    })();
  });

  async function copyShareLink() {
    if (!browser || !shareUrl) return;
    try {
      await navigator.clipboard.writeText(shareUrl);
      copyStatus = 'copied';
      setTimeout(() => {
        copyStatus = 'idle';
      }, 2000);
    } catch {
      copyStatus = 'error';
      setTimeout(() => {
        copyStatus = 'idle';
      }, 2000);
    }
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner">
    <header class="bb-page-head">
      {#if loadError}
        <p class="load-error" role="alert">{loadError}</p>
      {:else if !loaded}
        <p class="load-hint">Loading vote…</p>
      {:else}
        <h1 class="bb-page-title">{title}</h1>
      {/if}
      <p class="bb-page-sub">Vote ID: {voteId}</p>
      {#if loaded && !loadError}
        <p class="status-line" role="status">
          {#if hasResponses}
            This vote has responses and is closed to new ballots.
          {:else}
            Waiting for the first response. Votes cannot be edited after creation.
          {/if}
          {#if passwordProtected}
            Results require the vote password.
          {/if}
        </p>
      {/if}
    </header>

    {#if loaded && !loadError}
      <div class="manage-card bb-surface bb-surface--narrow">
        <section class="card-section">
          <h2 class="section-title-lg">Share Vote Link</h2>
          <div class="share-row">
            <div class="share-url-field" title={shareUrl}>{shareUrl}</div>
            <button class="copy-btn" type="button" onclick={copyShareLink}>
              <span class="copy-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect
                    x="5.5"
                    y="5.5"
                    width="8"
                    height="8"
                    rx="1"
                    stroke="white"
                    stroke-width="1.2"
                  />
                  <path
                    d="M4 10.5V3.5a1 1 0 0 1 1-1h7"
                    stroke="white"
                    stroke-width="1.2"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              {copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Failed' : 'Copy'}
            </button>
          </div>
        </section>

        <section class="card-section bordered">
          <h3 class="section-title-sm">Options</h3>
          <ol class="options-list">
            {#each options as option, i (i)}
              <li>{option}</li>
            {/each}
          </ol>
        </section>

        <section class="card-section bordered">
          <h3 class="section-title-sm">Voting Method</h3>
          <p class="method-value">{methodLabel}</p>
        </section>

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
      </div>
    {/if}
  </div>
</div>

<style>
  .manage-card {
    padding: 24px 25px 22px;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .card-section.bordered {
    border-top: 1px solid var(--border-subtle);
    padding-top: 17px;
    gap: var(--space-1);
  }

  .card-section.footnote {
    padding-top: 16px;
    margin-top: -4px;
  }

  .section-title-lg {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: var(--text-primary);
  }

  .section-title-sm {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
  }

  .share-row {
    display: flex;
    gap: var(--space-1);
    align-items: stretch;
  }

  .share-url-field {
    flex: 1;
    min-width: 0;
    height: 40px;
    padding: 8px var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    background: var(--bg-share-url);
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 96px;
    height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--accent);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .copy-btn:hover {
    filter: brightness(1.05);
  }

  .copy-icon {
    display: inline-flex;
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

  .method-value {
    margin: 0;
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }

  .footnote-text,
  .results-hint {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .status-line {
    margin: 8px 0 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .load-hint,
  .load-error {
    margin: 0;
    font-size: 18px;
    line-height: 26px;
    color: var(--text-primary);
  }

  .load-error {
    color: #b42318;
  }

  :global(html[data-theme='dark']) .load-error {
    color: #f97066;
  }
</style>
