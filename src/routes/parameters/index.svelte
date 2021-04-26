<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  import type { AnyParameter, ParameterNode } from "$lib/parameters"
  import { improveParameter } from "$lib/parameters"

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
    improveParameter(null, rootParameter)
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
</main>
