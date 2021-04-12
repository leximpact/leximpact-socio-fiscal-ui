<script lang="ts">
  // import fetch from "cross-fetch"

  import type { AnyParameter } from "$lib/parameters"
  import { ParameterClass } from "$lib/parameters"

  export let id: string
  export let parameter: AnyParameter

  let open = false

  // $: retrieveParameter(node)

  // async function retrieveParameter(node: ParametersNode): Promise<void> {
  //   const res = await fetch(node.href)
  //   if (!res.ok) {
  //     console.error(
  //       `Error ${res.status} while retrieving parameter at ${
  //         node.href
  //       }\n\n${await res.text()}`,
  //     )
  //   }
  //   parameter = await res.json()
  // }
</script>

<button class="align-top flex text-left" on:click={() => (open = !open)}>
  {#if parameter.class !== ParameterClass.Node}
    <svg
      class="h-5 w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.938l1-4H9.031z"
        fill-rule="evenodd"
      />
    </svg>
  {:else if open}
    <!-- Heroicon name: solid/chevron-down -->
    <svg
      class="h-5 inline w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
        fill-rule="evenodd"
      />
    </svg>
  {:else}
    <!-- Heroicon name: solid/chevron-right -->
    <svg
      class="h-5 inline w-5"
      fill="currentColor"
      viewBox="0 0 20 20"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        clip-rule="evenodd"
        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
        fill-rule="evenodd"
      />
    </svg>
  {/if}
  <div>
    {#if parameter.name === id}
      <span>{id}</span>
    {:else}
      <abbr title={parameter.name}>{id}</abbr>
    {/if}
    {#if parameter.description !== undefined}
      : <em>{parameter.description}</em>
    {/if}
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
      <div>Source : <a href={parameter.source}>{parameter.source}</a></div>
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
                    >{#if source !== undefined}<a href={source}>source</a
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
                      >{parameter.rate_unit ??
                        parameter.threshold_unit ??
                        ""}</td
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
  </div>
</button>
{#if parameter.class === ParameterClass.Node && open}
  <ul class="ml-4">
    {#each Object.entries(parameter.children) as [childId, child]}
      <li class="my-2">
        <svelte:self id={childId} parameter={child} />
      </li>
    {/each}
  </ul>
{/if}
