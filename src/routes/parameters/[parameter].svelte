<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  export async function load({
    fetch,
    page,
    session,
  }: LoadInput): Promise<LoadOutput> {
    const { parameter: name } = page.params
    const url = new URL(`parameters/${name}`, session.apiBaseUrl).toString()
    const res = await fetch(url)
    if (!res.ok) {
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      }
    }
    return {
      props: {
        parameter: await res.json(),
      },
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"
  import type { AnyParameter } from "$lib/parameters"
  import { ParameterClass } from "$lib/parameters"

  export let parameter: AnyParameter
</script>

<svelte:head>
  <title>{parameter.name} | Paramètres | {$session.title}</title>
</svelte:head>

<main>
  <h1>
    Paramètre
    <var>{parameter.name}</var>
    {#if parameter.description !== undefined}
      : <em>{parameter.description}</em>
    {/if}
  </h1>
  {#if parameter.documentation !== undefined}
    <div>{parameter.documentation}</div>
  {/if}
  {#if parameter.unit !== undefined}
    <div>Unité : {parameter.unit}</div>
  {/if}
  {#if parameter.reference !== undefined}
    <div>
      Références :
      {#if typeof parameter.reference === "string"}
        {parameter.reference}
      {:else if Array.isArray(parameter.reference)}
        <ul class="list-disc list-inside">
          {#each parameter.reference as reference}
            <li>{reference}</li>
          {/each}
        </ul>
      {:else}
        <dl>
          {#each Object.entries(parameter.reference) as [instant, reference]}
            <dt>{instant}</dt>
            <dd class="ml-4">{reference}</dd>
          {/each}
        </dl>
      {/if}
    </div>
  {/if}
  {#if parameter.source !== undefined}
    <div>
      Source : <a class="link" href={parameter.source}>{parameter.source}</a>
    </div>
  {/if}
  {#if parameter.class === ParameterClass.Parameter}
    {#if parameter.values !== undefined}
      <div>
        <div>Valeurs :</div>
        <table class="border border-collapse table-auto">
          <thead>
            <tr>
              <th class="border p-1 text-center">Date</th>
              <!-- <th class="border p-1 text-center">Nom</th> -->
              <th class="border p-1 text-center">Valeur</th>
              <th class="border p-1 text-center">Unité</th>
              <th class="border p-1 text-center">Source</th>
            </tr>
          </thead>
          <tbody>
            {#each parameter.values as { instant, /* name, */ source, unit, value }}
              <tr>
                <td class="border p-1 text-center">{instant}</td>
                <!-- <td class= "border p-1 text-center">{name}</td> -->
                <td class="border p-1 text-center">{value ?? ""}</td>
                <td class="border p-1 text-center">{unit ?? ""}</td>
                <td class="border p-1 text-center"
                  >{#if source !== undefined}<a class="link" href={source}
                      >source</a
                    >{/if}</td
                >
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  {:else if parameter.class === ParameterClass.Scale}
    <div>
      <div>Barème de type {parameter.type}:</div>
      <table class="border border-collapse table-auto">
        <thead>
          <tr>
            <th class="border p-1 text-center">Date</th>
            <th class="border p-1 text-center">Seuil</th>
            <th class="border p-1 text-center">Unité de seuil</th>
            <th class="border p-1 text-center">Value</th>
          </tr>
        </thead>
        <tbody>
          {#each Object.entries(parameter.brackets) as [instant, bracket]}
            {#if bracket === null}
              <tr>
                <td class="border p-1 text-center">{instant}</td>
                <td class="border p-1 text-center" colspan="3" />
              </tr>
            {:else}
              {#each Object.entries(bracket) as [threshold, value], index}
                <tr>
                  {#if index === 0}
                    <td
                      class="border p-1 text-center"
                      rowspan={Object.keys(bracket).length}>{instant}</td
                    >
                  {/if}
                  <td class="border p-1 text-center">{threshold}</td>
                  <td class="border p-1 text-center"
                    >{parameter.rate_unit ?? parameter.threshold_unit ?? ""}</td
                  >
                  <td class="border p-1 text-center">{value ?? ""}</td>
                </tr>
              {/each}
            {/if}
          {/each}
        </tbody>
      </table>
    </div>
  {/if}

  {#if parameter.referring_variables !== undefined}
    <section>
      <h1>Variables dépendantes</h1>
      <ul class="list-disc list-inside">
        {#each parameter.referring_variables as variableName}
          <li>
            <a class="link" href="/variables/{variableName}">{variableName}</a>
          </li>
        {/each}
      </ul>
    </section>
  {/if}

  <hr class="my-4" />

  <section>
    <h1>JSON</h1>

    <pre>{JSON.stringify(parameter, null, 2)}</pre>
  </section>
</main>
