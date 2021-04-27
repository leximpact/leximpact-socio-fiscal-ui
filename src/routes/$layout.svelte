<script>
  import "../global.css"

  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  import NavBar from "$lib/components/NavBar.svelte"

  const reform = writable({})
  setContext("reform", reform)

  const simulationRequested = writable(false)
  setContext("simulationRequested", simulationRequested)

  const situationComplement = writable({})
  setContext("situationComplement", situationComplement)

  const situationCore = writable({})
  setContext("situationCore", situationCore)
</script>

<NavBar />

<slot />
