<script lang="ts">
  import ParametersNode from "$lib/ParametersNode.svelte"
  import type { ParametersTree } from "$lib/parameters"

  export let tree: ParametersTree
</script>

<ul class="list-disc list-inside">
  {#each Object.entries(tree) as [id, node]}
    <li>
      <ParametersNode {id} {node} />
    </li>
  {/each}
</ul>
