<script lang="ts">
  import fetch from "cross-fetch"

  import { session } from "$app/stores"
  import VariableView from "$lib/components/variables/VariableView.svelte"
  import type { Variable } from "$lib/variables"

  export let name: string
  export let pane: string

  let variable: Variable | undefined = undefined

  $: retrieveVariable(name)

  async function retrieveVariable(name: string): Promise<void> {
    const url = new URL(`variables/${name}`, $session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (res.ok) {
      variable = await res.json()
    } else {
      console.error(
        `Error ${
          res.status
        } while retrieving variable "${name}" at ${url}\n\n${await res.text()}`,
      )
      variable = undefined
    }
  }
</script>

{#if variable !== undefined}
  <VariableView {variable} />
{/if}
