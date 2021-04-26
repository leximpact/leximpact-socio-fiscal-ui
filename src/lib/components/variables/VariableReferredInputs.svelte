<script lang="ts">
  import type { Variable } from "$lib/variables"

  export let newSelfTargetUrl: (urlPath: string) => string
  export let variables: Variable[]
</script>

{#if variables.length > 0}
  <ul>
    {#each variables as variable}
      <li>
        <a class="link" href={newSelfTargetUrl(`/variables/${variable.name}`)}
          >{variable.name}</a
        >
      </li>
    {/each}
  </ul>
{/if}
