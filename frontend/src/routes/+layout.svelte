<script lang="ts">
  import '../app.css';
  import '$lib/styles/ui.css';

  let { children } = $props();
</script>

<svelte:head>
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
  <link
    href="https://fonts.googleapis.com/css2?family=Crimson+Pro:wght@500;600&family=Inter:wght@400;500&display=swap"
    rel="stylesheet"
  />
</svelte:head>

{@render children()}
