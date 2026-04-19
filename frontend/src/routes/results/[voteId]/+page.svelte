<script lang="ts">
  import ResultsPage from '$lib/results/ResultsPage.svelte';
  import type { PageProps } from './$types';

  let { data }: PageProps = $props();
</script>

<svelte:head>
  <title>Results — {data.summary.vote.title} — Ballot Box</title>
  <meta name="robots" content="noindex" />
</svelte:head>

<ResultsPage summary={data.summary} />
