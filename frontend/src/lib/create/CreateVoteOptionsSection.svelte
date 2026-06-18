<script lang="ts">
  import CreateVoteTitleField from './CreateVoteTitleField.svelte';
  import CreateVoteOptionInputs from './CreateVoteOptionInputs.svelte';

  let {
    title = $bindable(),
    options = $bindable(),
    onAddOption,
  }: {
    title: string;
    options: string[];
    onAddOption: () => void;
  } = $props();
</script>

<CreateVoteTitleField bind:title />
<CreateVoteOptionInputs bind:options {onAddOption} />
