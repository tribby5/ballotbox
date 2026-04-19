<script lang="ts">
  import { onMount } from 'svelte';
  import { browser } from '$app/environment';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import { VOTING_METHODS, type VotingMethodValue } from '$lib/votingMethods';

  let { voteId }: { voteId: string } = $props();

  /** Demo seed until API exists — matches Figma sample copy */
  let title = $state('Best pet');
  let options = $state(['dog', 'cat']);
  let method = $state<VotingMethodValue>('ranked_pairs');

  let shareUrl = $state('');
  let copyStatus = $state<'idle' | 'copied' | 'error'>('idle');

  onMount(() => {
    if (browser) {
      shareUrl = `${window.location.origin}/vote/${voteId}`;
    } else {
      shareUrl = `/vote/${voteId}`;
    }
  });

  function addOption() {
    if (options.length >= 30) return;
    options = [...options, ''];
  }

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

  function saveChanges() {
    // Wire-up to API later
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner">
    <header class="bb-page-head">
      <h1 class="title-field-wrap">
        <label class="sr-only" for="manage-vote-title">Vote title</label>
        <input
          id="manage-vote-title"
          class="title-field"
          type="text"
          autocomplete="off"
          bind:value={title}
        />
      </h1>
      <p class="bb-page-sub">Vote ID: {voteId}</p>
    </header>

    <div class="manage-card bb-surface bb-surface--narrow">
      <section class="card-section">
        <h2 class="section-title-lg">Share Vote Link</h2>
        <div class="share-row">
          <div class="share-url-field" title={shareUrl}>{shareUrl || `/vote/${voteId}`}</div>
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
        <div class="options-block">
          <div class="options-row">
            <span class="options-meta">Numbered for voters</span>
            <button
              class="bb-link-accent"
              type="button"
              onclick={addOption}
              disabled={options.length >= 30}
            >
              <span class="bb-link-accent-icon" aria-hidden="true">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M8 3v10M3 8h10"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
              </span>
              Add Option
            </button>
          </div>
          <div class="option-inputs">
            {#each options as option, i (i)}
              <div class="option-line">
                <span class="option-num" aria-hidden="true">{i + 1}.</span>
                <input
                  class="bb-input bb-input--flex"
                  type="text"
                  autocomplete="off"
                  placeholder="Option {i + 1}"
                  value={option}
                  oninput={(e) => {
                    const next = [...options];
                    next[i] = e.currentTarget.value;
                    options = next;
                  }}
                />
              </div>
            {/each}
          </div>
        </div>
      </section>

      <section class="card-section bordered">
        <div class="bb-label-row">
          <label class="bb-label" for="manage-voting-method">Voting Method</label>
          <a
            class="bb-info-link"
            href="/methods"
            aria-label="Learn about voting methods"
            title="Learn about voting methods"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <circle cx="8" cy="8" r="6.5" stroke="currentColor" stroke-width="1.2" />
              <path
                d="M8 11.2V10M8 7.5V5.5"
                stroke="currentColor"
                stroke-width="1.2"
                stroke-linecap="round"
              />
            </svg>
          </a>
        </div>
        <select id="manage-voting-method" class="bb-select" bind:value={method}>
          {#each VOTING_METHODS as m (m.value)}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </section>

      <div class="save-wrap">
        <button class="bb-btn-primary-lg" type="button" onclick={saveChanges}>Save changes</button>
      </div>

      <section class="card-section bordered footnote">
        <p class="footnote-text">
          Results will be available after the first response is submitted.
        </p>
      </section>
    </div>
  </div>
</div>

<style>
  .title-field-wrap {
    margin: 0;
    font-weight: inherit;
  }

  .title-field {
    display: block;
    width: 100%;
    margin: 0;
    padding: 0;
    border: none;
    border-radius: var(--radius-sm);
    background: transparent;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 30px;
    line-height: 36px;
    color: var(--text-primary);
  }

  .title-field:focus {
    outline: 2px solid var(--accent);
    outline-offset: 4px;
  }

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

  .options-block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .options-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
  }

  .options-meta {
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
  }

  .option-inputs {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .option-line {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .option-num {
    flex-shrink: 0;
    width: 1.25rem;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
    text-align: right;
  }

  .save-wrap {
    margin-top: 2px;
  }

  .footnote-text {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
