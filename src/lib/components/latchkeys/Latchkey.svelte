<script lang="ts">
  import { scaleBand } from "d3-scale"
  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  import { LayerCake, Svg } from "$lib/components/layercake"
  import type { Decomposition } from "$lib/decompositions"
  import { walkDecomposition } from "$lib/decompositions"
  import AxisX from "./AxisX.svelte"
  import AxisY from "./AxisY.svelte"
  import Rows from "./Rows.svelte"

  export let decomposition: Decomposition
  export let newSelfTargetUrl: (urlPath: string) => string
  export let showNulls: boolean
  export let vectorIndex: number

  let adaptYScale = false

  const showColoredRects = writable(false)
  setContext("showColoredRects", showColoredRects)

  $: data = [...walkDecomposition(decomposition, true)]

  $: xDomain = computeXDomain(data, vectorIndex, adaptYScale)

  $: yDomain = data
    .filter(({ delta }) => showNulls || delta[vectorIndex] !== 0)
    .map((node) => node.short_name)

  function computeXDomain(
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
  <div
    class="mx-auto pb-36 pl-12 pr-16 pt-4 w-full"
    style="height: {62 * data.length}px;"
  >
    <LayerCake
      {data}
      x={(node) => [
        node.values[vectorIndex]?.[0] ?? 0,
        node.values[vectorIndex]?.[1] ?? 0,
      ]}
      {xDomain}
      y="short_name"
      yScale={scaleBand().paddingInner([0.1]).round(true)}
      {yDomain}
    >
      <Svg>
        <Rows {newSelfTargetUrl} />
        <AxisX />
        <AxisY gridlines={false} />
      </Svg>
    </LayerCake>
  </div>

  <label
    ><input bind:checked={adaptYScale} type="checkbox" /> Adapter en permanence l'échelle
    des Y</label
  >
  <label
    ><input bind:checked={$showColoredRects} type="checkbox" /> Montrer les rectangles
    colorés en fond</label
  >
{/if}
