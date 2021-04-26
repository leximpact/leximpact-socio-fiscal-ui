<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  export async function load({
    fetch,
    page,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const { date, variable: name } = page.params
    const url = new URL(
      `variables/${name}/inputs/${date}`,
      session.apiBaseUrl,
    ).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    return {
      props: {
        variables: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { page, session } from "$app/stores"
  import VariableReferredInputs from "$lib/components/variables/VariableReferredInputs.svelte"
  import type { Variable } from "$lib/variables"

  export let variables: Variable[]

  $: params = $page.params

  $: date = params.date

  $: name = params.variable
</script>

<svelte:head>
  <title
    >Variables d'entrée au {date} | {name} | Variables | {$session.title}</title
  >
</svelte:head>

<main>
  <VariableReferredInputs newSelfTargetUrl={(url) => url} {variables} />
</main>
