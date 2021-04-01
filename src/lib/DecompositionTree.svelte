<script lang="ts">
  import type { Decomposition } from "$lib/decompositions"

  export let decomposition: Decomposition
  export let showNulls: boolean
</script>

<span>{Math.round(decomposition.delta)} €</span>
<span>{decomposition.short_name}</span>
{#if decomposition.children !== undefined}
  <ul class="list-disc list-inside ml-4">
    {#each decomposition.children as child}
      {#if showNulls || child.delta !== 0}
        <li><svelte:self decomposition={child} /></li>
      {/if}
    {/each}
  </ul>
{/if}
