<script lang="ts">
  import type { ValidCalculationQuery } from "$lib/calculations"
  import { newCalculationUrl } from "$lib/calculations"
  import DecompositionTree from "$lib/components/DecompositionTree.svelte"
  import TestCaseEdit from "$lib/components/TestCaseEdit.svelte"
  import VariablePane from "$lib/components/variables/VariablePane.svelte"
  import VariableReferredParametersPane from "$lib/components/variables/VariableReferredParametersPane.svelte"
  import Waterfall from "$lib/components/waterfalls/Waterfall.svelte"
  import type { Decomposition } from "$lib/decompositions"

  export let action: string
  export let decomposition: Decomposition
  export let pane: "pane1" | "pane2" | "pane3" | "pane4"
  export let query: ValidCalculationQuery
  export let showNulls: boolean
  export let vectorIndex: number
  export let year: number

  let component = undefined
  let properties = undefined

  $: updateComponentAndProperties(action, pane)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function newSelfTargetUrl(pane) {
    return (urlPath: string): string => {
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
    action: string,
    pane: "pane1" | "pane2" | "pane3" | "pane4",
  ) {
    {
      const match = /^variables\/([^/]+)$/.exec(action)
      if (match !== null) {
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
        component = VariableReferredParametersPane
        properties = { date: match[2], name: match[1] }
        return
      }
    }

    // No component found => Use default for pane.
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

{#if component === DecompositionTree}
  <DecompositionTree
    {decomposition}
    newSelfTargetUrl={newSelfTargetUrl(pane)}
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
    newSelfTargetUrl={newSelfTargetUrl(pane)}
    {showNulls}
    {vectorIndex}
    {...properties}
  />
{/if}
