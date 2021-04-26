<script lang="ts">
  import { goto } from "$app/navigation"
  import type { ValidCalculationQuery } from "$lib/calculations"
  import { newCalculationUrl } from "$lib/calculations"
  import DecompositionTree from "$lib/components/DecompositionTree.svelte"
  import ParameterPane from "$lib/components/parameters/ParameterPane.svelte"
  import TestCaseEdit from "$lib/components/TestCaseEdit.svelte"
  import VariablePane from "$lib/components/variables/VariablePane.svelte"
  import VariableReferredInputsPane from "$lib/components/variables/VariableReferredInputsPane.svelte"
  import VariableReferredParametersPane from "$lib/components/variables/VariableReferredParametersPane.svelte"
  import Waterfall from "$lib/components/waterfalls/Waterfall.svelte"
  import type { Decomposition } from "$lib/decompositions"

  export let actions: string[] | undefined
  export let decomposition: Decomposition
  export let pane: "pane1" | "pane2" | "pane3" | "pane4"
  export let query: ValidCalculationQuery
  export let showNulls: boolean
  export let vectorIndex: number
  export let year: number

  let component = undefined
  let properties = undefined

  $: newSelfTargetUrl = newSelfTargetUrlBuilder(pane)

  $: updateComponentAndProperties(actions, pane)

  function closeWindow() {
    actions = [...actions]
    actions.pop()
    if (actions.length === 0) {
      actions = undefined
    }
    goto(
      newCalculationUrl({
        ...query,
        [pane]: actions,
      }),
    )
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  function newSelfTargetUrlBuilder(pane) {
    return (urlPath: string): string => {
      // Variable-related views are shown in pane3.
      if (
        urlPath === "/parameters" ||
        urlPath.startsWith("/parameters/") ||
        urlPath === "/variables" ||
        urlPath.startsWith("/variables/")
      ) {
        const actions = [...(query.pane3 ?? []), urlPath.replace(/^\/+/, "")]
        return newCalculationUrl({
          ...query,
          pane3: actions,
        })
      }
      return urlPath
    }
  }

  function updateComponentAndProperties(
    actions: string[] | undefined | null,
    pane: "pane1" | "pane2" | "pane3" | "pane4",
  ) {
    const action = actions == null ? null : actions[actions.length - 1]
    if (action != null) {
      {
        const match = /^parameters\/([^/]+)$/.exec(action)
        if (match !== null) {
          component = ParameterPane
          properties = { name: match[1] }
          return
        }
      }

      {
        const match = /^variables\/([^/]+)$/.exec(action)
        if (match !== null) {
          component = VariablePane
          properties = { name: match[1] }
          return
        }
      }

      {
        const match = /^variables\/([^/]+)\/inputs\/(\d{4}-\d{2}-\d{2})$/.exec(
          action,
        )
        if (match !== null) {
          component = VariableReferredInputsPane
          properties = { date: match[2], name: match[1] }
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

{#if actions !== undefined}
  <button
    class="absolute border h-7 p-1 right-0 rounded top-0 w-7"
    on:click={closeWindow}
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
{:else if component === ParameterPane}
  <ParameterPane {newSelfTargetUrl} {...properties} />
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
  <VariablePane {newSelfTargetUrl} {...properties} />
{:else if component === VariableReferredInputsPane}
  <VariableReferredInputsPane {newSelfTargetUrl} {...properties} />
{:else if component === VariableReferredParametersPane}
  <VariableReferredParametersPane {newSelfTargetUrl} {...properties} />
{:else if component === Waterfall}
  <Waterfall
    {decomposition}
    {newSelfTargetUrl}
    {showNulls}
    {vectorIndex}
    {...properties}
  />
{/if}
