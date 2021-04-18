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
  import { goto } from "$app/navigation"
  import { page, session } from "$app/stores"
  import ParametersSearch from "$lib/components/parameters/ParametersSearch.svelte"
  // import ParameterTree from "$lib/components/parameters/ParameterTree.svelte"

  export let rootParameter: ParameterNode

  let initialTerm: string | undefined = undefined

  $: term = $page.query.get("q") ?? ""

  function searchTermChanged({ detail }: { detail: string }) {
    if (initialTerm === undefined) {
      initialTerm = term
    }
    term = detail
    history.replaceState(
      null,
      "",
      `${$page.path}${term ? `?q=${encodeURIComponent(term)}` : ""}`,
    )
  }

  async function parameterClicked({
    detail: parameter,
  }: {
    detail: AnyParameter
  }) {
    if (initialTerm !== undefined) {
      // Restore the initial term in browser history.
      await goto(
        `${$page.path}${
          initialTerm ? `?q=${encodeURIComponent(initialTerm)}` : ""
        }`,
        { replaceState: true },
      )
      // Push the current term.
      await goto(`${$page.path}${term ? `?q=${encodeURIComponent(term)}` : ""}`)
    }
    // Go to parameter page.
    await goto(`/parameters/${parameter.name}`)
  }
</script>

<svelte:head>
  <title>Paramètres{term ? ` « ${term} »` : " "} | {$session.title}</title>
</svelte:head>

<main>
  <h1>Paramètres</h1>

  <ParametersSearch
    dispatchItemClick={true}
    on:change={searchTermChanged}
    on:itemClick={parameterClicked}
    {rootParameter}
    {term}
  />
  <!-- <ul>
    {#each Object.entries(rootParameter.children) as [childId, child]}
      <li class="my-2">
        <ParameterTree id={childId} parameter={child} />
      </li>
    {/each}
  </ul> -->
</main>
