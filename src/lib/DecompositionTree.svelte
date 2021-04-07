<script lang="ts">
  import type { Decomposition } from "$lib/decompositions"

  export let decomposition: Decomposition
  export let open: boolean
  export let showNulls: boolean
  export let vectorIndex: number
</script>

<button class="flex" on:click={() => (open = !open)}>
  {#if decomposition.children === undefined}
    <span class="h5 w-5" />
  {:else if open}
    <!-- Heroicon name: solid/chevron-down -->
    <svg
      class="h-5 inline w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        fill-rule="evenodd"
      />
    </svg>
  {:else}
    <!-- Heroicon name: solid/chevron-right -->
    <svg
      class="h-5 inline w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        fill-rule="evenodd"
      />
    </svg>
  {/if}
  <span>{Math.round(decomposition.delta[vectorIndex])} €</span>
  <span class="ml-2">{decomposition.short_name}</span>
</button>
{#if open && decomposition.children !== undefined}
  <ul class="ml-4">
    {#each decomposition.children as child}
      {#if showNulls || child.delta[vectorIndex] !== 0}
        <li>
          <svelte:self
            decomposition={child}
            open={false}
            {vectorIndex}
            {showNulls}
          />
        </li>
      {/if}
    {/each}
  </ul>
{/if}
