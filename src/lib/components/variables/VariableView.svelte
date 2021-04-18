<script lang="ts">
  import type { Variable } from "$lib/variables"

  export let variable: Variable
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

<hr class="my-4" />

<section>
  <h1>JSON</h1>

  <pre>{JSON.stringify(variable, null, 2)}</pre>
</section>
