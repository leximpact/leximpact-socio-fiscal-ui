<script lang="ts">
  import type { Decomposition } from "$lib/decompositions"

  export let decomposition: Decomposition
  export let showNulls: boolean
  export let vectorIndex: number
</script>

<span>{Math.round(decomposition.delta[vectorIndex])} €</span>
<span>{decomposition.short_name}</span>
{#if decomposition.children !== undefined}
  <ul class="list-disc list-inside ml-4">
    {#each decomposition.children as child}
      {#if showNulls || child.delta[vectorIndex] !== 0}
        <li><svelte:self decomposition={child} {vectorIndex} {showNulls} /></li>
      {/if}
    {/each}
  </ul>
{/if}
