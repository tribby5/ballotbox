<script lang="ts">
  import { goto } from '$app/navigation';
  import SiteHeader from '$lib/layout/SiteHeader.svelte';

  let joinCode = $state('');
  let resultsCode = $state('');
  let manageCode = $state('');

  const trim = (v: string) => v.trim();
  const canJoin = $derived(trim(joinCode).length > 0);
  const canView = $derived(trim(resultsCode).length > 0);
  const canManage = $derived(trim(manageCode).length > 0);

  function goManage() {
    const code = trim(manageCode);
    if (!code) return;
    void goto(`/manage/${encodeURIComponent(code)}`);
  }

  function goVote() {
    const code = trim(joinCode);
    if (!code) return;
    void goto(`/vote/${encodeURIComponent(code)}`);
  }

  function goResults() {
    const code = trim(resultsCode);
    if (!code) return;
    void goto(`/results/${encodeURIComponent(code)}`);
  }
</script>

<SiteHeader />

<div class="bb-page">
<main class="bb-page-inner bb-page-inner--home">
  <section class="hero">
    <h1 class="hero-title">Ballot Box</h1>
    <p class="hero-sub">
      Create, share, and vote using ranked-choice voting methods. Explore different voting systems
      and see how they affect outcomes.
    </p>
  </section>

  <div class="cards">
    <a class="card card-row" href="/create">
      <div class="card-icon-wrap" aria-hidden="true">
        <svg class="card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
          <rect x="4" y="3" width="16" height="6" rx="1" stroke="currentColor" stroke-width="1.4" />
          <rect x="4" y="10" width="16" height="6" rx="1" stroke="currentColor" stroke-width="1.4" />
          <rect x="4" y="17" width="16" height="4" rx="1" stroke="currentColor" stroke-width="1.4" />
        </svg>
      </div>
      <div class="card-body">
        <h2 class="card-title">Create New Vote</h2>
        <p class="card-desc">Set up a new vote with custom options and voting methods</p>
      </div>
      <div class="card-cta" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M12 5v14M5 12h14" stroke="white" stroke-width="2" stroke-linecap="round" />
        </svg>
      </div>
    </a>

    <article class="card card-stack">
      <div class="card-stack-row">
        <div class="card-icon-wrap" aria-hidden="true">
          <svg class="card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <rect
              x="4"
              y="4"
              width="16"
              height="16"
              rx="2"
              stroke="currentColor"
              stroke-width="1.4"
            />
            <path
              d="M8 12.5 10.5 15 16 9"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="card-stack-text">
          <h2 class="card-title">Join a Vote</h2>
          <p class="card-desc">Enter a vote code to participate in an active vote</p>
        </div>
      </div>
      <div class="field-row">
        <label class="sr-only" for="join-code">Vote code to join</label>
        <input
          id="join-code"
          class="bb-input bb-input--flex"
          type="text"
          autocomplete="off"
          placeholder="Enter vote code"
          bind:value={joinCode}
        />
        <button class="bb-btn-primary-sm" type="button" disabled={!canJoin} onclick={goVote}>Join</button>
      </div>
    </article>

    <article class="card card-stack">
      <div class="card-stack-row">
        <div class="card-icon-wrap" aria-hidden="true">
          <svg class="card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M5 19V5M9 19v-6h6v6M15 19V9h4v10"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="card-stack-text">
          <h2 class="card-title">View Results</h2>
          <p class="card-desc">See the results of a vote with detailed breakdowns</p>
        </div>
      </div>
      <div class="field-row">
        <label class="sr-only" for="results-code">Vote code for results</label>
        <input
          id="results-code"
          class="bb-input bb-input--flex"
          type="text"
          autocomplete="off"
          placeholder="Enter vote code"
          bind:value={resultsCode}
        />
        <button class="bb-btn-primary-sm" type="button" disabled={!canView} onclick={goResults}>View</button>
      </div>
    </article>

    <article class="card card-stack">
      <div class="card-stack-row">
        <div class="card-icon-wrap" aria-hidden="true">
          <svg class="card-icon" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <circle cx="9" cy="11" r="3" stroke="currentColor" stroke-width="1.4" />
            <path
              d="M14 10h5M14 14h3"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
            <path
              d="M11 13 7 17"
              stroke="currentColor"
              stroke-width="1.4"
              stroke-linecap="round"
            />
          </svg>
        </div>
        <div class="card-stack-text">
          <h2 class="card-title">Manage Existing Vote</h2>
          <p class="card-desc">Access and manage a vote you've created</p>
        </div>
      </div>
      <div class="field-row">
        <label class="sr-only" for="manage-code">Vote code to manage</label>
        <input
          id="manage-code"
          class="bb-input bb-input--flex"
          type="text"
          autocomplete="off"
          placeholder="Enter vote code"
          bind:value={manageCode}
        />
        <button class="bb-btn-primary-sm" type="button" disabled={!canManage} onclick={goManage}>Manage</button>
      </div>
    </article>
  </div>
</main>
</div>

<style>
  .hero {
    text-align: center;
  }

  .hero-title {
    margin: var(--space-4) 0 var(--space-2);
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: clamp(36px, 5vw, 48px);
    line-height: 1.1;
    color: var(--text-primary);
  }

  .hero-sub {
    margin: 0 auto;
    max-width: 36rem;
    font-size: 18px;
    line-height: 28px;
    color: var(--text-muted);
  }

  .cards {
    width: 100%;
    max-width: 42rem;
    margin: 0 auto;
    display: flex;
    flex-direction: column;
    gap: var(--space-2);
  }

  .card {
    background: var(--bg-card);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-card);
    padding: 24px;
  }

  .card-row {
    display: flex;
    align-items: center;
    gap: var(--space-2);
    text-align: left;
    transition: box-shadow 0.15s ease, transform 0.15s ease;
  }

  .card-row:hover {
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.12);
    transform: translateY(-1px);
  }

  .card-row:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
  }

  .card-stack {
    display: flex;
    flex-direction: column;
    gap: var(--space-3);
  }

  .card-stack-row {
    display: flex;
    gap: var(--space-2);
    align-items: flex-start;
  }

  .card-stack-text {
    flex: 1;
    min-width: 0;
  }

  .card-icon-wrap {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--bg-icon);
    display: grid;
    place-items: center;
    color: var(--text-muted);
  }

  .card-icon {
    display: block;
  }

  .card-body {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .card-title {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: var(--text-primary);
  }

  .card-desc {
    margin: 0;
    font-size: 14px;
    line-height: 20px;
    color: var(--text-muted);
  }

  .card-cta {
    flex-shrink: 0;
    width: 48px;
    height: 48px;
    border-radius: var(--radius-md);
    background: var(--accent);
    display: grid;
    place-items: center;
  }

  .field-row {
    display: flex;
    gap: var(--space-1);
    align-items: stretch;
    width: 100%;
    padding-left: 64px;
  }

  @media (max-width: 640px) {
    .field-row {
      padding-left: 0;
      flex-direction: column;
    }

    .bb-btn-primary-sm {
      width: 100%;
    }
  }
</style>
