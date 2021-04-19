<script lang="ts">
  import type { Variable } from "$lib/variables"

  export let variables: Variable[]
</script>

{#if variables.length > 0}
  <ul>
    {#each variables as variable}
      <li>{variable.name}</li>
    {/each}
  </ul>
{/if}
