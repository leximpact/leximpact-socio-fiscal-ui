<script lang="ts">
  import Sockette from "sockette"

  import { browser } from "$app/env"
  import { session } from "$app/stores"
  import type { Decomposition } from "$lib/decompositions"
  import { decomposition as decompositionWithoutValue } from "$lib/decompositions"
  import DecompositionTree from "$lib/DecompositionTree.svelte"
  import type { Axis, Situation } from "$lib/situations"
  import TestCaseEdit from "$lib/TestCaseEdit.svelte"
  import Waterfall from "$lib/Waterfall"

  let adaptYScale = false
  let axes: Axis[][] = []
  let deltaByCode: { [code: string]: number[] } = {}
  let decomposition = updateDecompositionValues(
    decompositionWithoutValue as Decomposition,
    deltaByCode,
    1, // vectorLength
  )
  let showNulls = false
  let situation: Situation | undefined = undefined
  let vectorIndex = 0
  let vectorLength = 1
  let webSocket: Sockette | undefined = undefined
  let webSocketOpen = false
  let year = 2021

  $: if (browser) {
    openWebSocket()
  }

  function changeAxes({ detail }) {
    axes = detail

    vectorLength = 1
    for (const parallelAxes of axes) {
      // All the parallel axes have the same count.
      const axis = parallelAxes[0]
      vectorLength *= axis.count
    }

    decomposition = updateDecompositionValues(
      decompositionWithoutValue as Decomposition,
      deltaByCode,
      vectorLength,
    )
    if (webSocketOpen) {
      submit()
    }
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
              [result.code]: result.value,
            }
            decomposition = updateDecompositionValues(
              decompositionWithoutValue as Decomposition,
              deltaByCode,
              vectorLength,
            )
          }
        },
        // onopen: (event) => console.log("[WebSocket] Connected!", event),
        onopen: () => {
          webSocketOpen = true
          submit()
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
    let situationWithAxes = situation
    if (axes.length > 0) {
      // Remove variables used as axes from situation (otherwise OpenFisca Core fails).
      situationWithAxes = {
        axes,
        ...situationWithAxes,
      }
      for (const parallelAxes of axes) {
        nextAxis: for (const axis of parallelAxes) {
          const { name: code, index } = axis

          let individuIndex = 0
          for (let [name, individu] of Object.entries(
            situationWithAxes.individus,
          )) {
            if (index === individuIndex && individu[code] !== undefined) {
              individu = { ...individu }
              delete individu[code]
              situationWithAxes.individus = { ...situationWithAxes.individus }
              situationWithAxes.individus[name] = individu // Preserve order of individu in individus.
              continue nextAxis
            }
          }

          let familleIndex = 0
          for (let [name, famille] of Object.entries(
            situationWithAxes.familles,
          )) {
            if (index === familleIndex && famille[code] !== undefined) {
              famille = { ...famille }
              delete famille[code]
              situationWithAxes.familles = { ...situationWithAxes.familles }
              situationWithAxes.familles[name] = famille // Preserve order of famille in familles.
              continue nextAxis
            }
          }

          let foyerFiscalIndex = 0
          for (let [name, foyerFiscal] of Object.entries(
            situationWithAxes.foyers_fiscaux,
          )) {
            if (index === foyerFiscalIndex && foyerFiscal[code] !== undefined) {
              foyerFiscal = { ...foyerFiscal }
              delete foyerFiscal[code]
              situationWithAxes.foyers_fiscaux = {
                ...situationWithAxes.foyers_fiscaux,
              }
              situationWithAxes.foyers_fiscaux[name] = foyerFiscal // Preserve order of foyerFiscal in foyersFiscaux.
              continue nextAxis
            }
          }

          let menageIndex = 0
          for (let [name, menage] of Object.entries(
            situationWithAxes.menages,
          )) {
            if (index === menageIndex && menage[code] !== undefined) {
              menage = { ...menage }
              delete menage[code]
              situationWithAxes.menages = { ...situationWithAxes.menages }
              situationWithAxes.menages[name] = menage // Preserve order of menage in menages.
              continue nextAxis
            }
          }
        }
      }
    }

    webSocket.send(
      JSON.stringify({
        decomposition,
        situation: situationWithAxes,
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
    deltaByCode: { [code: string]: number[] },
    vectorLength: number,
    valuePrevious = undefined,
  ): Decomposition {
    if (valuePrevious === undefined) {
      valuePrevious = new Array(vectorLength).fill(0)
    }
    let children = node.children
    if (children !== undefined) {
      children = []
      let childValuePrevious = valuePrevious
      for (let child of node.children) {
        child = updateDecompositionValues(
          child,
          deltaByCode,
          vectorLength,
          childValuePrevious,
        )
        children.push(child)
        childValuePrevious = child.values.map((itemValue) => itemValue[1])
      }
    }
    let delta = deltaByCode[node.code]
    if (delta === undefined) {
      if (children === undefined) {
        delta = new Array(vectorLength).fill(0)
      } else {
        const firstChildValues = children[0].values
        const lastChildValues = children[children.length - 1].values
        delta = lastChildValues.map(
          (lastChildValue, index) =>
            lastChildValue[1] - firstChildValues[index][0],
        )
      }
    }
    return {
      ...node,
      children,
      delta,
      values: valuePrevious.map((previousItemValue, index) => [
        previousItemValue,
        previousItemValue + delta[index],
      ]),
    }
  }
</script>

<svelte:head>
  <title>Calculs | {$session.title}</title>
</svelte:head>

<main>
  <label class="block">
    Année
    <input max={2021} min={2013} step="1" type="number" bind:value={year} />
  </label>

  <TestCaseEdit
    bind:vectorIndex
    on:changeAxes={changeAxes}
    on:changeSituation={changeSituation}
    {year}
  />

  <div>
    <button on:click={submit}>Simuler</button>
  </div>

  <div class="flex">
    <div class="flex-shrink-0">
      <DecompositionTree
        {decomposition}
        open={true}
        {showNulls}
        {vectorIndex}
      />
    </div>

    <Waterfall {adaptYScale} {decomposition} {showNulls} {vectorIndex} />
  </div>

  <label
    ><input bind:checked={showNulls} type="checkbox" /> Montrer les montants nuls</label
  >
  <label
    ><input bind:checked={adaptYScale} type="checkbox" /> Adapter en permanence l'échelle
    des Y.</label
  >
</main>
