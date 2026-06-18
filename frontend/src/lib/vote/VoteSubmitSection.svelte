<script lang="ts">
  let {
    submitError,
    submittedProtected,
    submitting,
    votingClosed,
    submitLabel,
    onSubmit,
  }: {
    submitError: string | null;
    submittedProtected: boolean;
    submitting: boolean;
    votingClosed: boolean;
    submitLabel: string;
    onSubmit: () => void;
  } = $props();
</script>

{#if submitError}
  <p class="rank-error" role="alert">{submitError}</p>
{/if}

{#if submittedProtected}
  <p class="submit-ok" role="status">
    Your vote was recorded. The vote organizer controls access to results for this vote.
  </p>
{:else}
  <button
    class="bb-btn-primary-lg"
    type="button"
    disabled={submitting || votingClosed}
    onclick={onSubmit}
  >
    {submitLabel}
  </button>
{/if}

<style>
  .rank-error {
    margin: -28px 0 0;
    font-size: 14px;
    color: #b42318;
  }

  :global(html[data-theme='dark']) .rank-error {
    color: #f97066;
  }

  .submit-ok {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }
</style>
