<script lang="ts">
  import fetch from "cross-fetch"

  import { session } from "$app/stores"
  import VariableReferredInputs from "./VariableReferredInputs.svelte"
  import type { Variable } from "$lib/variables"

  export let date: string
  export let name: string
  export let newSelfTargetUrl: (urlPath: string) => string
  // export let pane: string

  let variables: Variable[] | undefined = undefined

  $: retrieveVariableReferredVariable(name, date)

  async function retrieveVariableReferredVariable(
    name: string,
    date: string,
  ): Promise<void> {
    const url = new URL(
      `variables/${name}/inputs/${date}`,
      $session.apiBaseUrl,
    ).toString()
    const res = await fetch(url)
    if (res.ok) {
      variables = await res.json()
    } else {
      console.error(
        `Error ${
          res.status
        } while retrieving referred variables of variable "${name}" at ${url}\n\n${await res.text()}`,
      )
      variables = undefined
    }
  }
</script>

{#if variables !== undefined}
  <VariableReferredInputs {newSelfTargetUrl} {variables} />
{/if}
