<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  export async function load({
    fetch,
    page,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const { variable: name } = page.params
    const url = new URL(`variables/${name}`, session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    return {
      props: {
        variable: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import VariableView from "$lib/components/variables/VariableView.svelte"
  import type { Variable } from "$lib/variables"

  export let variable: Variable
</script>

<svelte:head>
  <title>{variable.name} | Variables | {$session.title}</title>
</svelte:head>

<main>
  <VariableView editable={true} newSelfTargetUrl={(url) => url} {variable} />
</main>
