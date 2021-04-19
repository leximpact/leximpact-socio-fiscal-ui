<script lang="ts">
  import type { AnyParameter } from "$lib/parameters"

  export let parameters: AnyParameter[]
</script>

{#if parameters.length > 0}
  <ul>
    {#each parameters as parameter}
      <li>{parameter.name}</li>
    {/each}
  </ul>
{/if}
