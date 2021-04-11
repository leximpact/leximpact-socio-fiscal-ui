<script lang="ts">
  import { scaleBand } from "d3-scale"

  import type { Decomposition } from "$lib/decompositions"
  import { walkDecomposition } from "$lib/decompositions"
  import { LayerCake, Svg } from "$lib/layercake"
  import AxisX from "./AxisX.svelte"
  import AxisY from "./AxisY.svelte"
  import Column from "./Column.svelte"

  export let adaptYScale: boolean
  export let decomposition: Decomposition
  export let showNulls: boolean
  export let vectorIndex: number

  $: data = [...walkDecomposition(decomposition, true)]

  $: xDomain = data
    .filter(({ delta }) => showNulls || delta[vectorIndex] !== 0)
    .map((node) => node.short_name)

  $: yDomain = computeYDomain(data, vectorIndex, adaptYScale)

  function computeYDomain(
    data,
    vectorIndex: number,
    adaptYScale: boolean,
  ): [number, number] {
    let valueMin = undefined
    let valueMax = undefined
    for (const node of data) {
      if (adaptYScale) {
        for (const value of node.values[vectorIndex]) {
          if (valueMin === undefined || value < valueMin) {
            valueMin = value
          }
          if (valueMax === undefined || value > valueMax) {
            valueMax = value
          }
        }
      } else {
        for (const itemValues of node.values) {
          for (const value of itemValues) {
            if (valueMin === undefined || value < valueMin) {
              valueMin = value
            }
            if (valueMax === undefined || value > valueMax) {
              valueMax = value
            }
          }
        }
      }
    }
    return [valueMin, valueMax]
  }
</script>

{#if xDomain.length > 0 && yDomain.length > 0}
  <div class="h-96 mx-auto pb-36 pl-12 pr-16 pt-4 w-full">
    <LayerCake
      {data}
      x="short_name"
      xScale={scaleBand().paddingInner([0.02]).round(true)}
      {xDomain}
      y={(node) => [
        node.values[vectorIndex]?.[0] ?? 0,
        node.values[vectorIndex]?.[1] ?? 0,
      ]}
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
