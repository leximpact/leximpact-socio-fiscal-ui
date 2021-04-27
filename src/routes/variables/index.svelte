<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  export async function load({
    fetch,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const url = new URL("variables/", session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    return {
      props: {
        variableByName: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import type { VariableSummaryByName } from "$lib/variables"

  export let variableByName: VariableSummaryByName
</script>

<svelte:head>
  <title>Variables | {$session.title}</title>
</svelte:head>

<main>
  <h1>Variables</h1>

  <ul class="list-disc list-inside">
    {#each Object.entries(variableByName) as [name, variable]}
      <li>
        <a class="link" href="variables/{name}">
          <var>{name}</var>
          {#if variable.label !== undefined}
            : {variable.label}
          {/if}
        </a>
      </li>
    {/each}
  </ul>
</main>
