<script lang="ts">
  let { title = $bindable() }: { title: string } = $props();
</script>

<div class="bb-field-stack">
  <label class="bb-label" for="vote-title">Vote Title *</label>
  <input
    id="vote-title"
    class="bb-input"
    type="text"
    autocomplete="off"
    placeholder="What are we voting on?"
    bind:value={title}
  />
</div>
