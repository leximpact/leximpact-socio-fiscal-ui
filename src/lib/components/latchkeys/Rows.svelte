<script lang="ts">
  import { getContext } from "svelte"

  import Arrow from "./Arrow.svelte"

  export let newSelfTargetUrl: (urlPath: string) => string

  const { data, xGet, yGet, yRange, yScale } = getContext("LayerCake")

  $: [yRange0, yRange1] = $yRange

  $: height = $yScale.bandwidth()

  $: yPadding = $yScale.paddingInner() * $yScale.step()

  function* iterRows(nodes, xGet, yGet, height) {
    for (const node of nodes) {
      const [x0, x1] = xGet(node)
      const y = yRange0 + yRange1 - yGet(node) - height
      if (Number.isNaN(y)) {
        continue
      }
      yield {
        height,
        node,
        x0,
        x1,
        y,
      }
    }
  }
</script>

<g class="column-group">
  {#each [...iterRows($data, $xGet, $yGet, height)] as { height, node, x0, x1, y }, i}
    <Arrow {height} {newSelfTargetUrl} {node} {x0} {x1} {y} {yPadding} />
  {/each}
</g>
