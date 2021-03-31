<script lang="ts">
  import { scaleBand } from "d3-scale"

  import type { Decomposition } from "$lib/decompositions"
  import { walkDecomposition } from "$lib/decompositions"
  import { LayerCake, Svg } from "$lib/layercake"
  import AxisX from "./AxisX.svelte"
  import AxisY from "./AxisY.svelte"
  import Column from "./Column.svelte"

  export let decomposition: Decomposition

  $: data = [...walkDecomposition(decomposition, true)]

  $: xDomain = data
    .filter(({ delta }) => delta !== 0)
    .map((node) => node.short_name)

  $: yDomain = computeYDomain(data)

  function computeYDomain(data): [number, number] {
    let valueMin = undefined
    let valueMax = undefined
    for (const node of data) {
      for (const value of node.values) {
        if (valueMin === undefined || value < valueMin) {
          valueMin = value
        }
        if (valueMax === undefined || value > valueMax) {
          valueMax = value
        }
      }
    }
    return [valueMin, valueMax]
  }
</script>

{#if xDomain.length > 0}
  <div class="h-64 max-w-2xl mx-auto">
    <LayerCake
      {data}
      x="short_name"
      xScale={scaleBand().paddingInner([0.02]).round(true)}
      {xDomain}
      y={(node) => [node.values[0], node.values[1]]}
      {yDomain}
    >
      <Svg>
        <Column />
        <AxisX gridlines={false} />
        <AxisY textAnchor="end" />
      </Svg>
    </LayerCake>
  </div>
{/if}
