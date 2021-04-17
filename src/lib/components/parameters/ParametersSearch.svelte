<script lang="ts">
  import Fuse from "fuse.js"

  import type { AnyParameter, ParameterNode } from "$lib/parameters"
  import { ParameterClass } from "$lib/parameters"

  export let rootParameter: ParameterNode
  export let term = ""

  let foundParameters: AnyParameter[] = []

  $: parameters = [...walkParameters(rootParameter)]

  $: fuse = new Fuse(parameters, {
    keys: ["id", "title", "titles"],
  })

  function* iterParameterAncestors(
    parameter?: AnyParameter | undefined | null,
  ): Generator<AnyParameter, void, unknown> {
    if (parameter == null || !parameter.id) {
      return
    }
    yield* iterParameterAncestors(parameter.parent)
    yield parameter
  }

  function onInput(event: Event) {
    const target = event.target as HTMLInputElement
    term = target.value
    // dispatch("input", target)
    foundParameters = fuse.search(term, { limit: 50 })
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

{#if foundParameters.length > 0}
  <ul class="list-disc list-inside">
    {#each foundParameters as parameter}
      <li>
        <a class="link" href="/parameters/{parameter.name}">
          {#each [...iterParameterAncestors(parameter)] as ancestor, index}
            {#if index > 0}&gt;{/if}
            <span class="mx-2 first:ml-0">{ancestor.title}</span>
          {/each}
        </a>
      </li>
    {/each}
  </ul>
{/if}
