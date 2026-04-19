<script lang="ts">
  import ManageVotePage from '$lib/manage/ManageVotePage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Manage vote — Ballot Box</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<ManageVotePage voteId={data.voteId} />
