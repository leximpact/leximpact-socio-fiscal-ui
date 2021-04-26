<script lang="ts">
  import fetch from "cross-fetch"

  import { session } from "$app/stores"
  import ParameterView from "$lib/components/parameters/ParameterView.svelte"
  import type { Parameter, ParameterNode } from "$lib/parameters"
  import { improveParameter } from "$lib/parameters"

  export let name: string
  export let newSelfTargetUrl: (urlPath: string) => string
  // export let pane: string

  let ancestors: ParameterNode[] | undefined = undefined
  let parameter: Parameter | undefined = undefined

  $: retrieveParameter(name)

  async function retrieveParameter(name: string): Promise<void> {
    const url = new URL(`parameters/${name}`, $session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (res.ok) {
      const result = await res.json()
      let parent = null
      for (const ancestor of result.ancestors) {
        improveParameter(parent, ancestor)
        parent = ancestor
      }
      improveParameter(parent, result.parameter)
      ancestors = result.ancestors
      parameter = result.parameter
    } else {
      console.error(
        `Error ${
          res.status
        } while retrieving parameter "${name}" at ${url}\n\n${await res.text()}`,
      )
      ancestors = undefined
      parameter = undefined
    }
  }
</script>

{#if parameter !== undefined}
  <ParameterView {ancestors} editable={true} {newSelfTargetUrl} {parameter} />
{/if}
