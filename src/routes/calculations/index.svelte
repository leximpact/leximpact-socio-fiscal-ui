<script lang="ts">
  import Sockette from "sockette"

  import { browser } from "$app/env"
  import { session } from "$app/stores"
  import type { Decomposition } from "$lib/decompositions"
  import { decomposition as decompositionWithoutValue } from "$lib/decompositions"
  import DecompositionTree from "$lib/DecompositionTree.svelte"
  import type { Situation } from "$lib/situations"
  import TestCaseEdit from "$lib/TestCaseEdit.svelte"
  import Waterfall from "$lib/Waterfall"

  let deltaByCode: { [code: string]: number } = {}
  let decomposition = updateDecompositionValues(
    decompositionWithoutValue as Decomposition,
    deltaByCode,
  )
  let showNulls = false
  let situation: Situation | undefined = undefined
  let webSocket: Sockette | undefined = undefined
  let webSocketOpen = false
  let year = 2021

  $: if (browser) {
    openWebSocket()
  }

  function changeSituation({ detail }) {
    situation = detail
    if (webSocketOpen) {
      submit()
    }
  }

  function openWebSocket() {
    webSocket = new Sockette(
      new URL("ws", $session.apiWebSocketBaseUrl).toString(),
      {
        // maxAttempts: 10,
        onmessage: (event) => {
          const result = JSON.parse(event.data)
          if (result.error !== undefined) {
            console.error("Error:", result)
          } else {
            deltaByCode = {
              ...deltaByCode,
              [result.code]: result.value.reduce((sum, cell) => {
                sum += cell
                return sum
              }, 0),
            }
            decomposition = updateDecompositionValues(
              decompositionWithoutValue,
              deltaByCode,
            )
          }
        },
        // onopen: (event) => console.log("[WebSocket] Connected!", event),
        onopen: () => {
          webSocketOpen = true
          if (situation !== undefined) {
            submit()
          }
        },
        // onreconnect: (event) =>
        //   console.log("[WebSocket] Reconnecting...", event),
        // onmaximum: (event) =>
        //   console.log("[WebSocket] Stop Attempting!", event),
        // onclose: (event) => console.log("[WebSocket] Closed!", event),
        // onerror: (event) => console.log("[WebSocket] Error:", event),
        // timeout: 5e3,
      },
    )
  }

  function submit() {
    if (situation === undefined) {
      return
    }
    deltaByCode = {}
    webSocket.send(
      JSON.stringify({
        decomposition,
        situation,
        period: year.toString(),
      }),
    )
    webSocket.send(
      JSON.stringify({
        calculate: true,
      }),
    )
  }

  function updateDecompositionValues(
    node: Decomposition,
    deltaByCode: { [code: string]: number },
    valuePrevious = 0,
  ): Decomposition {
    let children = node.children
    if (children !== undefined) {
      children = []
      let childValuePrevious = valuePrevious
      for (let child of node.children) {
        child = updateDecompositionValues(
          child,
          deltaByCode,
          childValuePrevious,
        )
        children.push(child)
        childValuePrevious = child.values[1]
      }
    }
    let delta = deltaByCode[node.code]
    if (delta === undefined) {
      if (children === undefined) {
        delta = 0
      } else {
        delta = children[children.length - 1].values[1] - children[0].values[0]
      }
    }
    return {
      ...node,
      children,
      delta,
      values: [valuePrevious, valuePrevious + delta],
    }
  }
</script>

<label class="block">
  Année
  <input max={2021} min={2013} step="1" type="number" bind:value={year} />
</label>

<TestCaseEdit on:change={changeSituation} {year} />

<div>
  <button on:click={submit}>Simuler</button>
</div>

<div class="flex">
  <div>
    <DecompositionTree {decomposition} {showNulls} />
  </div>

  <Waterfall {decomposition} {showNulls} />
</div>

<label
  ><input bind:checked={showNulls} type="checkbox" /> Montrer les montants nuls</label
>
