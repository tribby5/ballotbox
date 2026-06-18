<script lang="ts">
  let {
    voteId,
    password = $bindable(),
    passwordError,
    checkingPassword,
    onSubmit,
  }: {
    voteId: string;
    password: string;
    passwordError: string | null;
    checkingPassword: boolean;
    onSubmit: () => void;
  } = $props();
</script>

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
      if (e.key === 'Enter') onSubmit();
    }}
  />
  {#if passwordError}
    <p class="password-error" role="alert">{passwordError}</p>
  {/if}
  <button
    class="bb-btn-primary-lg"
    type="button"
    disabled={checkingPassword || !password.trim()}
    onclick={onSubmit}
  >
    {checkingPassword ? 'Checking…' : 'View results'}
  </button>
</div>

<style>
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
