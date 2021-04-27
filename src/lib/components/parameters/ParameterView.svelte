<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import type { AnyParameter, ParameterNode } from "$lib/parameters"
  import { ParameterClass } from "$lib/parameters"
  import type { Reform } from "$lib/reforms"

  export let ancestors: ParameterNode[]
  export let editable: boolean
  export let newSelfTargetUrl: (urlPath: string) => string
  export let parameter: AnyParameter

  const reform = getContext("reform") as Writable<Reform>
  let validStart = undefined
  let validValue = undefined

  $: change = $reform[parameter.name]

  $: start = change?.start

  $: value = change?.value

  function changeStart(start) {
    validStart = start
    updateReform(validStart, validValue)
  }

  function changeValue(value) {
    validValue = parseFloat(value)
    if (validValue == null || Number.isNaN(validValue)) {
      validValue = undefined
    }
    updateReform(validStart, validValue)
  }

  function updateReform(start: string, value) {
    if (start !== undefined && value !== undefined) {
      $reform = {
        ...$reform,
        [parameter.name]: {
          start,
          value: validValue,
        },
      }
    }
  }
</script>

<h1>
  Paramètre
  {#each ancestors as ancestor}
    <a class="link" href={newSelfTargetUrl(`/parameters/${ancestor.name}`)}>
      {ancestor.title}
    </a>
    &gt;
  {/each}
  {parameter.title}
</h1>
<h2>
  <var>{parameter.name}</var>
  {#if parameter.description !== undefined}
    : <em>{parameter.description}</em>
  {/if}
</h2>
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
{#if parameter.class === ParameterClass.Node && parameter.children !== undefined}
  <ul class="ml-4">
    {#each Object.entries(parameter.children) as [childId, child]}
      <li class="my-2">
        <a class="link" href={newSelfTargetUrl(`/parameters/${child.name}`)}>
          {child.title}
        </a>
      </li>
    {/each}
  </ul>
{:else if parameter.class === ParameterClass.Parameter}
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
          {#if editable}
            <tr>
              <td class="border p-1 text-center"
                ><input
                  on:change={({ target }) => changeStart(target.value)}
                  type="date"
                  value={start}
                /></td
              >
              <!-- <td class= "border p-1 text-center">{name}</td> -->
              <td class="border p-1 text-center"
                ><input
                  type="number"
                  on:change={({ target }) => changeValue(target.value)}
                  {value}
                /></td
              >
              <td class="border p-1 text-center" />
              <td class="border p-1 text-center" />
            </tr>
          {/if}
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
          <a class="link" href={newSelfTargetUrl(`/variables/${variableName}`)}
            >{variableName}</a
          >
        </li>
      {/each}
    </ul>
  </section>
{/if}
<!--
<hr class="my-4" />

<section>
  <h1>JSON</h1>

  <pre>{JSON.stringify(parameter, null, 2)}</pre>
</section> -->
