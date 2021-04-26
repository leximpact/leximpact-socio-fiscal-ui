<script lang="ts">
  import type { AnyParameter } from "$lib/parameters"

  export let newSelfTargetUrl: (urlPath: string) => string
  export let parameters: AnyParameter[]
</script>

{#if parameters.length > 0}
  <ul>
    {#each parameters as parameter}
      <li>
        <a class="link" href={newSelfTargetUrl(`/parameters/${parameter.name}`)}
          >{parameter.name}</a
        >
      </li>
    {/each}
  </ul>
{/if}
