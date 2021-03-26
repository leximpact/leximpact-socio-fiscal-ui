<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  export async function load({ fetch, page }: LoadInput): Promise<LoadOutput> {
    const { variable: id } = page.params
    const url = `https://fr.openfisca.org/api/latest/variable/${id}`
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
  import type { Variable } from "$lib/variables"

  export let variable: Variable
</script>

<h1>
  Variable
  <var>{variable.id}</var>
  {#if variable.description != null}
    : {variable.description}
  {/if}
</h1>
{#if variable.formulas != null}
  <dl>
    {#each Object.entries(variable.formulas) as [date, formula]}
      <dt>{date}</dt>
      <dd>
        {#if formula.documentation != null}
          <div class="whitespace-pre-line">
            {formula.documentation.replace(/^\n+/, "").replace(/\n+$/, "")}
          </div>
        {/if}
        <p><a href={formula.source}>Source</a></p>
        <pre>{formula.content}</pre>
      </dd>
    {/each}
  </dl>
{/if}

<hr class="my-4" />

<h2>JSON</h2>
<pre>{JSON.stringify(variable, null, 2)}</pre>
