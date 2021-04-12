<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  import type { ParameterNode } from "$lib/parameters"

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
    const parameter = await res.json()
    // const parameterById = await res.json()
    // const parametersTree: { [id: string]: ParametersNode } = {}
    // const parametersRootNode: ParametersNode = {
    //   // Dummy root node of parameters tree.
    //   children: parametersTree,
    //   description: null,
    //   href: "",
    // }
    // for (const parameterId of Object.keys(parameterById)) {
    //   const idSegments: string[] = []
    //   let node = parametersRootNode
    //   for (const idSegment of parameterId.split(".")) {
    //     idSegments.push(idSegment)
    //     let tree = node.children
    //     if (tree === undefined) {
    //       tree = node.children = {}
    //     }
    //     node = tree[idSegment]
    //     if (node === undefined) {
    //       node = tree[idSegment] = {
    //         description: null,
    //         href: `https://fr.openfisca.org/api/latest/parameter/${idSegments.join(
    //           "/",
    //         )}`,
    //       }
    //     }
    //   }
    // }
    return {
      props: {
        parameter,
        // parametersTree,
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import ParameterTree from "$lib/ParameterTree.svelte"

  export let parameter: ParameterNode
</script>

<svelte:head>
  <title>Paramètres | {$session.title}</title>
</svelte:head>

<main>
  <h1>Paramètres</h1>

  <ul>
    {#each Object.entries(parameter.children) as [childId, child]}
      <li class="my-2">
        <ParameterTree id={childId} parameter={child} />
      </li>
    {/each}
  </ul>
</main>
