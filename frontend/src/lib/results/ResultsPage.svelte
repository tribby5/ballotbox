<script lang="ts">
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import { VOTING_METHODS } from '$lib/votingMethods';
  import {
    fetchVoteResultsSummary,
    type VoteResultsSummary,
  } from '$lib/results/voteResultsRecord';

  let { voteId }: { voteId: string } = $props();

  let loading = $state(true);
  let loadError = $state<string | null>(null);
  let needsPassword = $state(false);
  let password = $state('');
  let passwordError = $state<string | null>(null);
  let checkingPassword = $state(false);
  let summary = $state<VoteResultsSummary | null>(null);

  async function loadResults(pwd?: string) {
    loading = true;
    loadError = null;
    passwordError = null;

    try {
      const result = await fetchVoteResultsSummary(voteId, pwd);
      if (result.status === 'not_found') {
        loadError = 'Vote not found, or Supabase is not configured.';
        summary = null;
        needsPassword = false;
        return;
      }
      if (result.status === 'password_required') {
        needsPassword = true;
        summary = null;
        return;
      }
      if (result.status === 'invalid_password') {
        needsPassword = true;
        passwordError = 'Incorrect password.';
        summary = null;
        return;
      }
      needsPassword = false;
      summary = result.summary;
    } catch (e) {
      loadError = e instanceof Error ? e.message : 'Could not load results.';
      summary = null;
    } finally {
      loading = false;
      checkingPassword = false;
    }
  }

  onMount(() => {
    void loadResults();
  });

  async function submitPassword() {
    if (checkingPassword) return;
    checkingPassword = true;
    await loadResults(password);
  }

  const methodLabel = $derived.by(() => {
    const current = summary;
    if (!current) return '';
    return (
      VOTING_METHODS.find((m) => m.value === current.vote.voting_method)?.label ?? 'Unknown method'
    );
  });

  const voteCountLine = $derived.by(() => {
    const current = summary;
    if (!current) return '';
    return `${current.responseCount} ${current.responseCount === 1 ? 'vote' : 'votes'} received`;
  });
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner bb-page-inner--results">
    {#if loading}
      <p class="load-hint">Loading results…</p>
    {:else if loadError}
      <p class="load-error" role="alert">{loadError}</p>
    {:else if needsPassword}
      <header class="bb-page-head">
        <h1 class="bb-page-title">Results</h1>
        <p class="bb-page-sub">Vote ID: {voteId}</p>
      </header>
      <div class="password-card bb-surface bb-surface--padded bb-surface--narrow">
        <p class="password-lead">This vote is password-protected. Enter the password to view results.</p>
        <label class="bb-label" for="results-password">Password</label>
        <input
          id="results-password"
          class="bb-input"
          type="password"
          autocomplete="current-password"
          bind:value={password}
          onkeydown={(e) => {
            if (e.key === 'Enter') void submitPassword();
          }}
        />
        {#if passwordError}
          <p class="password-error" role="alert">{passwordError}</p>
        {/if}
        <button
          class="bb-btn-primary-lg"
          type="button"
          disabled={checkingPassword || !password.trim()}
          onclick={() => void submitPassword()}
        >
          {checkingPassword ? 'Checking…' : 'View results'}
        </button>
      </div>
    {:else if summary}
      <header class="bb-page-head">
        <h1 class="bb-page-title">{summary.vote.title}</h1>
        <p class="bb-page-sub">{voteCountLine}</p>
      </header>

      <section
        class="winner-card bb-surface bb-surface--wide bb-surface--winner bb-mx-auto"
        aria-labelledby="winner-heading"
      >
        <p id="winner-heading" class="winner-kicker">Winner</p>
        <p class="winner-name">{summary.winnerLabel}</p>
        <p class="winner-method">Using {methodLabel}</p>
      </section>

      <section
        class="bb-surface bb-surface--padded bb-surface--wide bb-surface--stack-tight bb-mx-auto"
        aria-labelledby="detail-heading"
      >
        <div class="detail-card-head">
          <h2 id="detail-heading" class="detail-title">Detailed Results</h2>
          <span class="detail-chevron" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path
                d="M5 7.5 10 12.5 15 7.5"
                stroke="currentColor"
                stroke-width="1.5"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
          </span>
        </div>
        <div class="detail-body" aria-label="Detailed results (coming soon)"></div>
      </section>
    {/if}
  </div>
</div>

<style>
  .load-hint {
    margin: 0;
    font-size: 16px;
    color: var(--text-muted);
  }

  .load-error {
    margin: 0;
    font-size: 16px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .load-error {
    color: #f97066;
  }

  .password-card {
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .password-lead {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .password-error {
    margin: 0;
    font-size: 14px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .password-error {
    color: #f97066;
  }
</style>
