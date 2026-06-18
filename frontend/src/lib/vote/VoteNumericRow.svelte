<script lang="ts">
  let {
    label,
    rank,
    value,
    maxRank,
    onChange,
  }: {
    label: string;
    rank: number;
    value: string;
    maxRank: number;
    onChange: (value: string) => void;
  } = $props();
</script>

<li class="numeric-row">
  <span class="option-label-static">{label}</span>
  <label class="sr-only" for="rank-{rank}">Rank for {label}</label>
  <input
    id="rank-{rank}"
    class="bb-input bb-input--narrow"
    type="text"
    inputmode="numeric"
    autocomplete="off"
    placeholder="1–{maxRank}"
    {value}
    oninput={(e) => onChange(e.currentTarget.value)}
  />
</li>

<style>
  .numeric-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: var(--space-2);
    padding: 12px var(--space-2);
    border: 1px solid var(--border-subtle);
    border-radius: var(--radius-md);
    background: var(--bg-card);
  }

  .option-label-static {
    font-size: 16px;
    line-height: 24px;
    color: var(--text-primary);
  }
</style>
