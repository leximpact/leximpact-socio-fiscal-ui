<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const url = "https://fr.openfisca.org/api/latest/variables"
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    return {
      props: {
        variableById: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import type { VariableSummaryById } from "$lib/variables"

  export let variableById: VariableSummaryById
</script>

<h1>Variables</h1>
<ul class="list-disc list-inside">
  {#each Object.entries(variableById) as [id, variable]}
    <li>
      <a href="variables/{id}">
        <var>{id}</var>
        {#if variable.description !== null}
          : {variable.description}
        {/if}
      </a>
    </li>
  {/each}
</ul>
