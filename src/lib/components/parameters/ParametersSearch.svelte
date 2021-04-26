<script lang="ts">
  import Fuse from "fuse.js"
  import { createEventDispatcher } from "svelte"

  import type { AnyParameter, ParameterNode } from "$lib/parameters"
  import { iterParameterAncestors, ParameterClass } from "$lib/parameters"

  export let dispatchItemClick: boolean
  export let rootParameter: ParameterNode
  export let term = ""

  const dispatch = createEventDispatcher()

  $: parameters = [...walkParameters(rootParameter)]

  $: fuse = new Fuse(parameters, {
    keys: ["id", "title", "titles"],
  })

  $: found = fuse.search(term, { limit: 50 })

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement
    term = target.value
    dispatch("change", term)
  }

  function parameterClicked(event: Event, parameter: AnyParameter) {
    if (dispatchItemClick) {
      event.preventDefault()
      dispatch("itemClick", parameter)
    }
  }

  function* walkParameters(
    parameter: AnyParameter,
    depthFirst = false,
  ): Generator<AnyParameter, void, unknown> {
    if (!depthFirst && parameter.class !== ParameterClass.Node) {
      yield parameter
    }
    switch (parameter.class) {
      case ParameterClass.Node:
        for (const child of Object.values(parameter.children)) {
          yield* walkParameters(child, depthFirst)
        }
        break
      default:
    }
    if (depthFirst && parameter.class !== ParameterClass.Node) {
      yield parameter
    }
  }
</script>

<input autocomplete="off" on:input={onInput} type="search" value={term} />

{#if found.length > 0}
  <ul class="list-disc list-inside">
    {#each found as { item: parameter }}
      <li>
        <a
          class="link"
          on:click={(event) => parameterClicked(event, parameter)}
          href="/parameters/{parameter.name}"
        >
          {#each [...iterParameterAncestors(parameter)] as ancestor, index}
            {#if index > 0}&gt;{/if}
            <span class="mx-2 first:ml-0">{ancestor.title}</span>
          {/each}
        </a>
      </li>
    {/each}
  </ul>
{/if}
