<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import { goto } from "$app/navigation"
  import type { Decomposition } from "$lib/decompositions"

  export let height: number
  export let newSelfTargetUrl: (urlPath: string) => string
  export let node: Decomposition
  export let x0: number
  export let x1: number
  export let y: number
  export let yPadding: number

  // const barStrokeWidth = 1
  // const barStrokeHalfWidth = barStrokeWidth / 2
  const chevronHeightWidthRatio = 2.8
  const chevronStrokeWidth = 5
  const chevronStrokeHalfWidth = chevronStrokeWidth / 2
  const showColoredRects = getContext("showColoredRects") as Writable<boolean>
  const verticalLineStrokeWidth = 2

  $: halfHeight = height / 2

  $: chevronHeight = height - chevronStrokeWidth

  $: chevronHalfHeight = chevronHeight / 2

  $: chevronWidth = chevronHeight / chevronHeightWidthRatio

  $: fill = node.children === undefined ? (x0 > x1 ? "red" : "green") : "blue"

  $: width = x0 < x1 ? x1 - x0 : x0 - x1

  // Width of the pointed bar minus the arrow part
  $: barWidth = width - chevronStrokeHalfWidth - chevronWidth

  // Ensure that chevron is not wider than width
  $: chevronCappedWidth = Math.min(
    chevronWidth,
    Math.abs(width - chevronStrokeWidth),
  )

  $: chevronCappedHalfHeight =
    (chevronCappedWidth * chevronHeightWidthRatio) / 2

  $: x = x0 < x1 ? x0 : x1
</script>

{#if $showColoredRects}
  <rect
    class="group-rect"
    {fill}
    {height}
    stroke="black"
    stroke-width="0.1"
    {width}
    {x}
    {y}
  />
{/if}

<g
  on:click={() => goto(newSelfTargetUrl(`/variables/${node.code}`))}
  transform={x0 < x1
    ? `rotate(180, ${x + width / 2}, ${y + height / 2})`
    : null}
>
  {#if barWidth > 0}
    <!-- Pointed Bar-->
    <path
      d="M{x + chevronStrokeHalfWidth + chevronWidth} {y +
        chevronStrokeHalfWidth}
        l{-chevronWidth} {chevronHalfHeight}
        l{chevronWidth} {chevronHalfHeight}
        l{barWidth} 0
        l0 {-chevronHeight}
        l{-barWidth} 0"
      fill="#CCD3E7"
    />
  {:else}
    <!-- Triangle (= pointed bar without the bar)-->
    <path
      d="M{x + chevronStrokeHalfWidth + chevronCappedWidth} {y +
        halfHeight -
        chevronCappedHalfHeight}
        l{-chevronCappedWidth} {chevronCappedHalfHeight}
        l{chevronCappedWidth} {chevronCappedHalfHeight}"
      fill="#CCD3E7"
    />
  {/if}

  <!-- Chevron -->
  <path
    d="M{x + chevronStrokeHalfWidth + chevronCappedWidth} {y +
      halfHeight -
      chevronCappedHalfHeight}
      l{-chevronCappedWidth} {chevronCappedHalfHeight}
      l{chevronCappedWidth} {chevronCappedHalfHeight}"
    fill="transparent"
    stroke="#5E709E"
    stroke-linecap="round"
    stroke-linejoin="round"
    stroke-width={chevronStrokeWidth}
  />
</g>

<!-- Vertical Line -->
<line
  stroke="#95A1C0"
  stroke-width={verticalLineStrokeWidth}
  x1={x0}
  y1={y - yPadding - height / 2}
  x2={x0}
  y2={y + height - chevronStrokeHalfWidth}
/>
