<script lang="ts">
  import fetch from "cross-fetch"

  import { session } from "$app/stores"
  import VariableReferredParameters from "$lib/components/variables/VariableReferredParameters.svelte"
  import type { AnyParameter } from "$lib/parameters"

  export let date: string
  export let name: string
  export let newSelfTargetUrl: (urlPath: string) => string
  // export let pane: string

  let parameters: AnyParameter[] | undefined = undefined

  $: retrieveVariableReferredParameter(name, date)

  async function retrieveVariableReferredParameter(
    name: string,
    date: string,
  ): Promise<void> {
    const url = new URL(
      `variables/${name}/parameters/${date}`,
      $session.apiBaseUrl,
    ).toString()
    const res = await fetch(url)
    if (res.ok) {
      parameters = await res.json()
    } else {
      console.error(
        `Error ${
          res.status
        } while retrieving referred parameters of variable "${name}" at ${url}\n\n${await res.text()}`,
      )
      parameters = undefined
    }
  }
</script>

{#if parameters !== undefined}
  <VariableReferredParameters {newSelfTargetUrl} {parameters} />
{/if}
