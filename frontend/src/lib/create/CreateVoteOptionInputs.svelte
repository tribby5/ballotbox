<script lang="ts">
  import './create-vote.css';

  let {
    options = $bindable(),
    onAddOption,
  }: {
    options: string[];
    onAddOption: () => void;
  } = $props();

  function updateOption(index: number, value: string) {
    const next = [...options];
    next[index] = value;
    options = next;
  }
</script>

<div class="bb-field-stack options-block create-vote-option-inputs">
  <div class="options-row">
    <span class="bb-label">Options * (2–30)</span>
    <button
      class="bb-link-accent"
      type="button"
      onclick={onAddOption}
      disabled={options.length >= 30}
    >
      <span class="bb-link-accent-icon" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
          <path
            d="M8 3v10M3 8h10"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
          />
        </svg>
      </span>
      Add Option
    </button>
  </div>
  <div class="option-inputs">
    {#each options as option, i (i)}
      <input
        class="bb-input"
        type="text"
        autocomplete="off"
        placeholder="Option {i + 1}"
        value={option}
        oninput={(e) => updateOption(i, e.currentTarget.value)}
      />
    {/each}
  </div>
</div>
