<script lang="ts">
  import type { VotingMethodValue } from '$lib/votingMethods';
  import CreateVoteMethodField from './CreateVoteMethodField.svelte';
  import CreateVoteFinalizeSection from './CreateVoteFinalizeSection.svelte';

  let {
    method = $bindable(),
    password = $bindable(),
    saveError,
    saving,
    onFinalize,
  }: {
    method: VotingMethodValue;
    password: string;
    saveError: string | null;
    saving: boolean;
    onFinalize: () => void;
  } = $props();
</script>

<CreateVoteMethodField bind:method />
<CreateVoteFinalizeSection bind:password {saveError} {saving} {onFinalize} />
