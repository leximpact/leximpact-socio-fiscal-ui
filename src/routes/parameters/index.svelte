<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  import type { ParametersNode } from "$lib/parameters"

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const url = "https://fr.openfisca.org/api/latest/parameters"
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    const parameterById = await res.json()
    const parametersTree: { [id: string]: ParametersNode } = {}
    const parametersRootNode: ParametersNode = {
      // Dummy root node of parameters tree.
      children: parametersTree,
      description: null,
      href: "",
    }
    for (const parameterId of Object.keys(parameterById)) {
      const idSegments: string[] = []
      let node = parametersRootNode
      for (const idSegment of parameterId.split(".")) {
        idSegments.push(idSegment)
        let tree = node.children
        if (tree === undefined) {
          tree = node.children = {}
        }
        node = tree[idSegment]
        if (node === undefined) {
          node = tree[idSegment] = {
            description: null,
            href: `https://fr.openfisca.org/api/latest/parameter/${idSegments.join(
              "/",
            )}`,
          }
        }
      }
    }
    return {
      props: {
        parametersTree,
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import ParametersTree from "$lib/ParametersTree.svelte"

  export let parametersTree: { [id: string]: ParametersNode }
</script>

<svelte:head>
  <title>Paramètres | {$session.title}</title>
</svelte:head>

<main>
  <h1>Paramètres</h1>

  <ParametersTree tree={parametersTree} />
</main>
