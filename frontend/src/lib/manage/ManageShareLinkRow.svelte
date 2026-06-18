<script lang="ts">
  let {
    shareUrl,
    copyStatus,
    onCopy,
  }: {
    shareUrl: string;
    copyStatus: 'idle' | 'copied' | 'error';
    onCopy: () => void;
  } = $props();

  const copyLabel = $derived(
    copyStatus === 'copied' ? 'Copied' : copyStatus === 'error' ? 'Failed' : 'Copy',
  );
</script>

<section class="card-section">
  <h2 class="section-title-lg">Share Vote Link</h2>
  <div class="share-row">
    <div class="share-url-field" title={shareUrl}>{shareUrl}</div>
    <button class="copy-btn" type="button" onclick={onCopy}>
      <span class="copy-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <rect x="5.5" y="5.5" width="8" height="8" rx="1" stroke="white" stroke-width="1.2" />
          <path
            d="M4 10.5V3.5a1 1 0 0 1 1-1h7"
            stroke="white"
            stroke-width="1.2"
            stroke-linecap="round"
          />
        </svg>
      </span>
      {copyLabel}
    </button>
  </div>
</section>

<style>
  .card-section {
    display: flex;
    flex-direction: column;
    gap: var(--space-1);
  }

  .section-title-lg {
    margin: 0;
    font-family: var(--font-serif);
    font-weight: 500;
    font-size: 18px;
    line-height: 27px;
    color: var(--text-primary);
  }

  .share-row {
    display: flex;
    gap: var(--space-1);
    align-items: stretch;
  }

  .share-url-field {
    flex: 1;
    min-width: 0;
    height: 40px;
    padding: 8px var(--space-2);
    border-radius: var(--radius-md);
    border: 1px solid var(--border-subtle);
    background: var(--bg-share-url);
    font-size: 14px;
    line-height: 20px;
    color: var(--text-primary);
    display: flex;
    align-items: center;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .copy-btn {
    flex-shrink: 0;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    min-width: 96px;
    height: 40px;
    padding: 0 14px;
    border: none;
    border-radius: var(--radius-md);
    background: var(--accent);
    color: #fff;
    font-size: 16px;
    font-weight: 500;
    line-height: 24px;
  }

  .copy-btn:hover {
    filter: brightness(1.05);
  }

  .copy-icon {
    display: inline-flex;
  }
</style>
