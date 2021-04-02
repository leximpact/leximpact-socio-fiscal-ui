<script lang="ts">
  import type { Decomposition } from "$lib/decompositions"

  export let decomposition: Decomposition
  export let index: number
  export let showNulls: boolean
</script>

<span>{Math.round(decomposition.delta[index])} €</span>
<span>{decomposition.short_name}</span>
{#if decomposition.children !== undefined}
  <ul class="list-disc list-inside ml-4">
    {#each decomposition.children as child}
      {#if showNulls || child.delta[index] !== 0}
        <li><svelte:self decomposition={child} {index} {showNulls} /></li>
      {/if}
    {/each}
  </ul>
{/if}
