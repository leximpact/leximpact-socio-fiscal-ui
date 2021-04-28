<script>
  import { getContext } from "svelte"

  const { padding, xRange, yRange, yScale } = getContext("LayerCake")

  export let ticks = 4
  export let tickMarks = false
  export let gridlines = true
  export let formatTick = (d) => d
  export let xTick = 0
  export let yTick = 0

  $: tickVals = Array.isArray(ticks) ? ticks : $yScale.domain()

  $: yHalfBandwidth = $yScale.bandwidth() / 2

  $: [yRange0, yRange1] = $yRange
</script>

<g class="axis y-axis" transform="translate({-$padding.left}, 0)">
  {#each tickVals as tick, i}
    <g
      class="tick tick-{tick}"
      transform="translate({$xRange[0] + $padding.left}, {yRange0 +
        yRange1 -
        $yScale(tick)})"
    >
      {#if gridlines !== false}
        <line
          class="gridline"
          x2="100%"
          y1={yTick - yHalfBandwidth}
          y2={yTick - yHalfBandwidth}
        />
      {/if}
      {#if tickMarks === true}
        <line
          class="tick-mark"
          x1="0"
          x2={-6}
          y1={yTick - yHalfBandwidth}
          y2={yTick - yHalfBandwidth}
        />
      {/if}
      <text
        x={xTick}
        y={yTick - yHalfBandwidth}
        dx={-9}
        dy={4}
        style="text-anchor: end;">{formatTick(tick)}</text
      >
    </g>
  {/each}
</g>

<style>
  .tick {
    font-size: 0.725em;
    font-weight: 200;
  }

  .tick line {
    stroke: #aaa;
  }
  .tick .gridline {
    stroke-dasharray: 2;
  }

  .tick text {
    fill: #666;
  }

  .tick.tick-0 line {
    stroke-dasharray: 0;
  }
</style>
