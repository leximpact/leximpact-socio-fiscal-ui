<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  import { improveParameter } from "$lib/parameters"

  export async function load({
    fetch,
    page,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const { parameter: name } = page.params
    const url = new URL(`parameters/${name}`, session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    const { ancestors, parameter } = await res.json()
    let parent = null
    for (const ancestor of ancestors) {
      improveParameter(parent, ancestor)
      parent = ancestor
    }
    improveParameter(parent, parameter)

    return {
      props: {
        ancestors,
        parameter,
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import ParameterView from "$lib/components/parameters/ParameterView.svelte"
  import type { AnyParameter, ParameterNode } from "$lib/parameters"

  export let ancestors: ParameterNode[]
  export let parameter: AnyParameter
</script>

<svelte:head>
  <title>{parameter.name} | Paramètres | {$session.title}</title>
</svelte:head>

<main>
  <ParameterView
    {ancestors}
    editable={true}
    newSelfTargetUrl={(url) => url}
    {parameter}
  />
</main>
