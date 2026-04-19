<script lang="ts">
  import VotePage from '$lib/vote/VotePage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>{data.vote.title} — Vote — Ballot Box</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<VotePage vote={data.vote} />
