<script lang="ts">
  import './create-vote.css';

  let {
    password = $bindable(),
    saveError,
    saving,
    onFinalize,
  }: {
    password: string;
    saveError: string | null;
    saving: boolean;
    onFinalize: () => void;
  } = $props();
</script>

<div class="create-vote-finalize">
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
    onclick={onFinalize}
  >
    {saving ? 'Saving…' : 'Finalize Vote'}
  </button>
</div>
