<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  import type { AnyParameter, ParameterNode } from "$lib/parameters"
  import { ParameterClass } from "$lib/parameters"

  function improveParameters(
    parent: ParameterNode | undefined | null,
    id: string,
    parameter: AnyParameter,
  ): void {
    parameter.id = id
    if (parent != null) {
      parameter.parent = parent
    }
    const title =
      parameter.description === undefined
        ? id.replace(/_/g, " ").replace(/^\w/, (c) => c.toUpperCase())
        : parameter.description
    parameter.title = title
    parameter.titles = parent == null ? title : [parent.titles, title].join(" ")

    switch (parameter.class) {
      case ParameterClass.Node:
        for (const [id, child] of Object.entries(parameter.children)) {
          improveParameters(parameter, id, child)
        }
        break
      default:
    }
  }

  export async function load({
    fetch,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const url = new URL("parameters", session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    const rootParameter = await res.json()
    improveParameters(null, "", rootParameter)
    return {
      props: {
        rootParameter,
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import ParametersSearch from "$lib/components/parameters/ParametersSearch.svelte"
  // import ParameterTree from "$lib/components/parameters/ParameterTree.svelte"

  export let rootParameter: ParameterNode
</script>

<svelte:head>
  <title>Paramètres | {$session.title}</title>
</svelte:head>

<main>
  <h1>Paramètres</h1>

  <ParametersSearch {rootParameter} />

  <!-- <ul>
    {#each Object.entries(rootParameter.children) as [childId, child]}
      <li class="my-2">
        <ParameterTree id={childId} parameter={child} />
      </li>
    {/each}
  </ul> -->
</main>
