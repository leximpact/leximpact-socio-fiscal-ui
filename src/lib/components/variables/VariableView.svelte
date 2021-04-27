<script lang="ts">
  import { getContext } from "svelte"
  import type { Writable } from "svelte/store"

  import { pluralByEntityKey } from "$lib/entities"
  import type { SituationComplement, Situation } from "$lib/situations"
  import type { Variable } from "$lib/variables"

  export let editable: boolean
  export let newSelfTargetUrl: (urlPath: string) => string
  export let variable: Variable

  let date = new Date().toISOString().split("T")[0]
  const simulationRequested = getContext(
    "simulationRequested",
  ) as Writable<boolean>
  const situationComplement = getContext(
    "situationComplement",
  ) as Writable<SituationComplement>
  const situationCore = getContext("situationCore") as Writable<Situation>

  $: entityPlural = pluralByEntityKey[variable.entity]

  $: entitySituationComplement = $situationComplement[entityPlural]

  $: entitySituation = $situationCore[entityPlural]

  function changeValue(itemName, itemValue) {
    switch (variable.value_type) {
      case "float":
        itemValue = parseFloat(itemValue)
        if (itemValue == null || Number.isNaN(itemValue)) {
          itemValue = null
        }
        break
      case "int":
        itemValue = parseInt(itemValue)
        if (itemValue == null || Number.isNaN(itemValue)) {
          itemValue = null
        }
        break
    }
    $situationComplement[entityPlural] = {
      ...(entitySituationComplement ?? {}),
      [itemName]: {
        ...(entitySituationComplement?.[itemName] ?? {}),
        [variable.name]: itemValue ?? variable.default_value,
      },
    }
    $simulationRequested = true
  }
</script>

<h1>
  Variable
  <var>{variable.name}</var>
  {#if variable.label !== undefined}
    : <em>{variable.label}</em>
  {/if}
</h1>

{#if variable.documentation !== undefined}
  <div class="whitespace-pre-line">
    {variable.documentation.replace(/^\n+/, "").replace(/\n+$/, "")}
  </div>
{/if}

{#if variable.definition_period !== undefined}
  <div>Période de définition : {variable.definition_period}</div>
{/if}

{#if variable.entity !== undefined}
  <div>Entité : {variable.entity}</div>
{/if}

{#if variable.value_type !== undefined}
  <div>Type de valeur : {variable.value_type}</div>
{/if}

{#if variable.reference !== undefined}
  <section>
    <h1>Références</h1>
    <ul class="list-disc list-inside">
      {#each variable.reference as url}
        <li><a class="link" href={url}>{url}</a></li>
      {/each}
    </ul>
  </section>
{/if}

{#if variable.formulas !== undefined}
  <section>
    <h1>Formules</h1>
    <dl>
      {#each Object.entries(variable.formulas) as [date, formula]}
        <dt>{date}</dt>
        <dd class="ml-4">
          {#if formula === null}
            <i>Aucune formule à partir de cette date</i>
          {:else}
            {#if formula.documentation !== undefined}
              <div class="whitespace-pre-line">
                {formula.documentation.replace(/^\n+/, "").replace(/\n+$/, "")}
              </div>
            {/if}
            <p><a class="link" href={formula.source}>Source</a></p>
            <pre>{formula.source_code}</pre>
            {#if formula.parameters !== undefined}
              <section>
                <h1>Paramètres référencés</h1>
                <ul class="list-disc list-inside">
                  {#each formula.parameters as parameterName}
                    <li>
                      <a class="link" href="/parameters/{parameterName}"
                        >{parameterName}</a
                      >
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}
            {#if formula.variables !== undefined}
              <section>
                <h1>Variables référencées</h1>
                <ul class="list-disc list-inside">
                  {#each formula.variables as variableName}
                    <li>
                      <a class="link" href="/variables/{variableName}"
                        >{variableName}</a
                      >
                    </li>
                  {/each}
                </ul>
              </section>
            {/if}
          {/if}
        </dd>
      {/each}
    </dl>
  </section>

  <section>
    <div>
      <a
        class="link"
        href={newSelfTargetUrl(`/variables/${variable.name}/inputs/${date}`)}
        >Variables d'entrée influant sur la formule, à la date du {date}</a
      >
    </div>
    <div>
      <a
        class="link"
        href={newSelfTargetUrl(
          `/variables/${variable.name}/parameters/${date}`,
        )}>Paramètres influant sur la formule, à la date du {date}</a
      >
    </div>
  </section>
{/if}

{#if editable}
  <section>
    <h1>Valeur</h1>
    <ul>
      {#each Object.keys(entitySituation ?? {}) as itemName}
        <li>
          {itemName} :
          {#if variable.possible_values !== undefined}
            <select
              on:blur={({ target }) => changeValue(itemName, target.value)}
              on:change={({ target }) => changeValue(itemName, target.value)}
              value={entitySituationComplement?.[itemName]?.[variable.name] ??
                variable.default_value}
            >
              {#each Object.entries(variable.possible_values) as [symbol, label]}
                <option value={symbol}>{label}</option>
              {/each}
            </select>
          {:else}
            <input
              on:change={({ target }) => changeValue(itemName, target.value)}
              type="number"
              value={entitySituationComplement?.[itemName]?.[variable.name] ??
                variable.default_value}
            />
          {/if}
        </li>
      {/each}
    </ul>
  </section>
{/if}

{#if variable.referring_variables !== undefined}
  <section>
    <h1>Variables dépendantes</h1>
    <ul class="list-disc list-inside">
      {#each variable.referring_variables as variableName}
        <li>
          <a class="link" href="/variables/{variableName}">{variableName}</a>
        </li>
      {/each}
    </ul>
  </section>
{/if}
<!--
<hr class="my-4" />

<section>
  <h1>JSON</h1>

  <pre>{JSON.stringify(variable, null, 2)}</pre>
</section> -->
