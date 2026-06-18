<script lang="ts">
  import { VOTING_METHODS, type VotingMethodValue } from '$lib/votingMethods';

  let { method = $bindable() }: { method: VotingMethodValue } = $props();
</script>

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
