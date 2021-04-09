<script lang="ts">
  import { getContext } from "svelte"

  /* --------------------------------------------
   * Default styles
   */
  export let blue = "blue"
  export let green = "green"
  export let red = "red"
  export let stroke = "black"
  export let strokeWidth = 0.1

  const { data, xGet, xScale, yGet } = getContext("LayerCake")

  function* iterColumns(nodes, xGet, xScale, yGet) {
    for (const node of nodes) {
      const xVals = xGet(node)
      const x = xScale.bandwidth ? xVals : xVals[0]
      const width = xScale.bandwidth
        ? xScale.bandwidth()
        : Math.max(0, xVals[1] - xVals[0])
      const [y0, y1] = yGet(node)
      let height = y0 - y1
      if (Number.isNaN(height)) {
        continue
      }
      let y = y1
      if (height < 0) {
        height = -height
        y = y0
      }
      yield {
        fill: node.children === undefined ? (y0 < y1 ? red : green) : blue,
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
  {#each [...iterColumns($data, $xGet, $xScale, $yGet)] as { fill, fillOpacity, height, width, x, y }, i}
    <rect
      class="group-rect"
      data-id={i}
      {fill}
      fill-opacity={fillOpacity}
      {height}
      {width}
      {x}
      {y}
      {stroke}
      stroke-width={strokeWidth}
    />
  {/each}
</g>
