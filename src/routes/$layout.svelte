<script>
  import "../global.css"

  import { setContext } from "svelte"
  import { writable } from "svelte/store"

  import NavBar from "$lib/components/NavBar.svelte"

  const reform = writable({})
  setContext("reform", reform)
</script>

<NavBar />

<slot />
