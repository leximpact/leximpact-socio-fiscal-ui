<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ValidCalculationQuery } from "$lib/calculations"
  import { newCalculationUrl } from "$lib/calculations"
  import DecompositionTree from "$lib/components/DecompositionTree.svelte"
  import TestCaseEdit from "$lib/components/TestCaseEdit.svelte"
  import VariablePane from "$lib/components/variables/VariablePane.svelte"
  import VariableReferredParametersPane from "$lib/components/variables/VariableReferredParametersPane.svelte"
  import Waterfall from "$lib/components/waterfalls/Waterfall.svelte"
  import type { Decomposition } from "$lib/decompositions"

  export let action: string | undefined
  export let decomposition: Decomposition
  export let pane: "pane1" | "pane2" | "pane3" | "pane4"
  export let query: ValidCalculationQuery
  export let showNulls: boolean
  export let vectorIndex: number
  export let year: number

  let component = undefined
  let customAction = false
  let properties = undefined

  $: newSelfTargetUrl = newSelfTargetUrlBuilder(pane)

  $: updateComponentAndProperties(action, pane)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function newSelfTargetUrlBuilder(pane) {
    return (urlPath: string | undefined | null): string => {
      if (urlPath == null) {
        return newCalculationUrl({
          ...query,
          [pane]: undefined,
        })
      }
      if (urlPath === "/variables" || urlPath.startsWith("/variables/")) {
        return newCalculationUrl({
          ...query,
          pane3: urlPath.replace(/^\/+/, ""),
        })
      }
      return urlPath
    }
  }

  function updateComponentAndProperties(
    action: string | undefined,
    pane: "pane1" | "pane2" | "pane3" | "pane4",
  ) {
    if (action !== undefined) {
      {
        const match = /^variables\/([^/]+)$/.exec(action)
        if (match !== null) {
          customAction = true
          component = VariablePane
          properties = { name: match[1] }
          return
        }
      }

      {
        const match = /^variables\/([^/]+)\/parameters\/(\d{4}-\d{2}-\d{2})$/.exec(
          action,
        )
        if (match !== null) {
          customAction = true
          component = VariableReferredParametersPane
          properties = { date: match[2], name: match[1] }
          return
        }
      }
    }

    // No component found => Use default for pane.
    customAction = false
    switch (pane) {
      case "pane1":
        component = TestCaseEdit
        properties = {}
        return
      case "pane2":
        component = Waterfall
        properties = {}
        return
      case "pane3":
        component = DecompositionTree
        properties = {}
        return
    }
  }
</script>

{#if customAction}
  <button
    class="absolute border h-7 p-1 right-0 rounded top-0 w-7"
    on:click={() => goto(newSelfTargetUrl(null))}
  >
    <!-- Heroicon name: solid/x -->
    <svg
      class="h-5 w-5"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
    >
      <path
        clip-rule="evenodd"
        d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
        fill-rule="evenodd"
      />
    </svg>
  </button>
{/if}

{#if component === DecompositionTree}
  <DecompositionTree
    {decomposition}
    {newSelfTargetUrl}
    open={true}
    {showNulls}
    {vectorIndex}
    {...properties}
  />
{:else if component === TestCaseEdit}
  <TestCaseEdit
    on:changeAxes
    on:changeSituation
    on:changeVectorIndex
    vectorIndex
    {year}
    {...properties}
  />
{:else if component === VariablePane}
  <VariablePane {...properties} />
{:else if component === VariableReferredParametersPane}
  <VariableReferredParametersPane {...properties} />
{:else if component === Waterfall}
  <Waterfall
    {decomposition}
    {newSelfTargetUrl}
    {showNulls}
    {vectorIndex}
    {...properties}
  />
{/if}
