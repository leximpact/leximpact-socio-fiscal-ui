<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  export async function load({
    fetch,
    page,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const { date, variable: name } = page.params
    const url = new URL(
      `variables/${name}/parameters/${date}`,
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
        parameters: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { page, session } from "$app/stores"
  import VariableReferredParameters from "$lib/components/variables/VariableReferredParameters.svelte"
  import type { AnyParameter } from "$lib/parameters"

  export let parameters: AnyParameter[]

  $: params = $page.params

  $: date = params.date

  $: name = params.variable
</script>

<svelte:head>
  <title
    >Paramètres influant au {date} | {name} | Variables | {$session.title}</title
  >
</svelte:head>

<main>
  <VariableReferredParameters {parameters} />
</main>
