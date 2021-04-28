<script lang="ts">
  import { getContext } from "svelte"

  import { goto } from "$app/navigation"

  export let blue = "blue"
  export let green = "green"
  export let newSelfTargetUrl: (urlPath: string) => string
  export let red = "red"
  export let stroke = "black"
  export let strokeWidth = 0.1

  const { data, xGet, yGet, yRange, yScale } = getContext("LayerCake")

  $: [yRange0, yRange1] = $yRange

  $: height = $yScale.bandwidth()

  function* iterRows(nodes, xGet, yGet, height) {
    for (const node of nodes) {
      const [x0, x1] = xGet(node)
      let width = x0 - x1
      if (Number.isNaN(width)) {
        continue
      }
      let x = x1
      if (width < 0) {
        width = -width
        x = x0
      }
      const y = yRange0 + yRange1 - yGet(node) - height
      if (Number.isNaN(y)) {
        continue
      }
      yield {
        code: node.code,
        fill: node.children === undefined ? (x0 > x1 ? red : green) : blue,
        fillOpacity: node.children === undefined ? 1 : 0.25,
        height,
        width,
        x,
        y,
      }
    }
  }
</script>

<g class="column-group">
  {#each [...iterRows($data, $xGet, $yGet, height)] as { code, fill, fillOpacity, height, width, x, y }, i}
    <rect
      class="group-rect"
      data-id={i}
      {fill}
      fill-opacity={fillOpacity}
      {height}
      on:click={() => goto(newSelfTargetUrl(`/variables/${code}`))}
      {stroke}
      stroke-width={strokeWidth}
      {width}
      {x}
      {y}
    />
  {/each}
</g>
