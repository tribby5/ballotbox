<script lang="ts">
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';
  import { createVoteInSupabase } from '$lib/vote/createVote';
  import { VOTING_METHODS, type VotingMethodValue } from '$lib/votingMethods';

  function randomVoteId(): string {
    const chars = 'abcdefghijklmnopqrstuvwxyz0123456789';
    return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
  }

  let voteId = $state('');
  let title = $state('');
  let options = $state(['', '']);
  let method = $state<VotingMethodValue>('ranked_pairs');
  let password = $state('');
  let saving = $state(false);
  let saveError = $state<string | null>(null);

  onMount(() => {
    voteId = randomVoteId();
  });

  function addOption() {
    if (options.length >= 30) return;
    options = [...options, ''];
  }

  async function finalizeVote() {
    saveError = null;
    const t = title.trim();
    if (!t) {
      saveError = 'Please enter a vote title.';
      return;
    }
    const trimmedOpts = options.map((o) => o.trim()).filter(Boolean);
    if (trimmedOpts.length < 2) {
      saveError = 'Please enter at least two options.';
      return;
    }
    if (!voteId.trim()) {
      saveError = 'Vote ID is not ready yet; try again.';
      return;
    }
    saving = true;
    try {
      await createVoteInSupabase({
        public_id: voteId.trim(),
        title: t,
        optionLabels: options,
        voting_method: method,
        password,
      });
      await goto(`/manage/${encodeURIComponent(voteId.trim())}`);
    } catch (e) {
      const msg = e instanceof Error ? e.message : 'Could not create the vote.';
      saveError = /duplicate key|unique constraint/i.test(msg)
        ? 'That vote ID is already taken. Refresh to get a new one.'
        : msg;
    } finally {
      saving = false;
    }
  }
</script>

<SiteHeader />

<div class="bb-page">
  <div class="bb-page-inner create-page-inner">
    <header class="bb-page-head">
      <h1 class="bb-page-title">Create Vote</h1>
      <p class="bb-page-sub">Vote ID: {voteId || '…'}</p>
    </header>

    <div class="bb-surface bb-surface--padded bb-surface--narrow bb-surface--stack">
      <div class="bb-field-stack">
        <label class="bb-label" for="vote-title">Vote Title *</label>
        <input
          id="vote-title"
          class="bb-input"
          type="text"
          autocomplete="off"
          placeholder="What are we voting on?"
          bind:value={title}
        />
      </div>

      <div class="bb-field-stack options-block">
        <div class="options-row">
          <span class="bb-label">Options * (2–30)</span>
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
            <input
              class="bb-input"
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
          {/each}
        </div>
      </div>

      <div class="bb-field-stack">
        <div class="bb-label-row">
          <label class="bb-label" for="voting-method">Voting Method</label>
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
        <select id="voting-method" class="bb-select" bind:value={method}>
          {#each VOTING_METHODS as m (m.value)}
            <option value={m.value}>{m.label}</option>
          {/each}
        </select>
      </div>

      <div class="bb-field-stack password-block">
        <label class="bb-label" for="vote-password">Password (Optional)</label>
        <input
          id="vote-password"
          class="bb-input"
          type="password"
          autocomplete="new-password"
          placeholder="Protect results and editing"
          bind:value={password}
        />
        <p class="hint">If set, only you can view results and edit the vote</p>
      </div>

      {#if saveError}
        <p class="save-error" role="alert">{saveError}</p>
      {/if}

      <button
        class="bb-btn-primary-lg finalize"
        type="button"
        disabled={saving}
        onclick={() => void finalizeVote()}
      >
        {saving ? 'Saving…' : 'Finalize Vote'}
      </button>
    </div>
  </div>
</div>

<style>
  .create-page-inner {
    align-items: center;
  }

  .create-page-inner > :is(.bb-page-head, .bb-surface) {
    width: 100%;
    max-width: 39.5rem;
  }

  .options-block {
    gap: 12px;
  }

  .options-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    min-height: 20px;
  }

  .option-inputs {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .password-block {
    gap: 0;
  }

  .password-block .bb-label {
    margin-bottom: 4px;
  }

  .password-block .bb-input {
    margin-top: 4px;
  }

  .hint {
    margin: 8px 0 0;
    font-size: 12px;
    line-height: 16px;
    color: var(--text-muted);
  }

  .finalize {
    margin-top: 2px;
  }

  .save-error {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .save-error {
    color: #f97066;
  }
</style>
