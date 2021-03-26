<script lang="ts">
  import fetch from "cross-fetch"

  import ParametersTree from "$lib/ParametersTree.svelte"
  import type { Parameter, ParametersNode } from "$lib/parameters"

  export let id: string
  export let node: ParametersNode

  let open = false
  let parameter: Parameter | undefined = undefined

  $: retrieveParameter(node)

  async function retrieveParameter(node: ParametersNode): Promise<void> {
    const res = await fetch(node.href)
    if (!res.ok) {
      console.error(
        `Error ${res.status} while retrieving parameter at ${
          node.href
        }\n\n${await res.text()}`,
      )
    }
    parameter = await res.json()
  }
</script>

<button
  class="align-top text-left"
  on:click|stopPropagation={() => (open = !open)}
>
  <div>{id}</div>
  {#if node.description !== null}
    <p>{node.description}</p>
  {/if}
  {#if open}
    {#if parameter?.source !== undefined}
      <div><a href={parameter.source}>Source</a></div>
    {/if}
    {#if parameter?.values !== undefined}
      <div>
        <div>Valeurs :</div>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            {#each Object.entries(parameter.values) as [date, value]}
              <tr>
                <td>{date}</td>
                <td>{value}</td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
    {#if node.children !== undefined}
      <ParametersTree tree={node.children} />
    {/if}
  {/if}
</button>
