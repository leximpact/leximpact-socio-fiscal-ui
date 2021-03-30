<script lang="ts">
  import { scaleBand } from "d3-scale"

  import type { Decomposition } from "$lib/decompositions"
  import { walkDecomposition } from "$lib/decompositions"
  import { LayerCake, Svg } from "$lib/layercake"
  import AxisX from "./AxisX.svelte"
  import AxisY from "./AxisY.svelte"
  import Column from "./Column.svelte"

  export let decomposition: Decomposition

  $: data = [...walkDecomposition(decomposition)].filter(
    ({ value }) => value !== 0,
  )
</script>

<div class="h-64 w-full">
  <LayerCake
    {data}
    x="short_name"
    xScale={scaleBand().paddingInner([0.02]).round(true)}
    xDomain={[...walkDecomposition(decomposition)]
      .filter(({ value }) => value !== 0)
      .map((node) => node.short_name)}
    y="value"
  >
    <Svg>
      <Column />
      <AxisX />
      <AxisY />
    </Svg>
  </LayerCake>
</div>
