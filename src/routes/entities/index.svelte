<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const url = "https://fr.openfisca.org/api/latest/entities"
    const res = await fetch(url)

    if (res.ok) {
      return {
        props: {
          entityById: await res.json(),
        },
      }
    }

    return {
      status: res.status,
      error: new Error(`Could not load ${url}`),
    }
  }
</script>

<script lang="ts">
  import { session } from "$app/stores"

  export let entityById: unknown
</script>

<svelte:head>
  <title>Entités | {$session.title}</title>
</svelte:head>

<main>
  <h1>Entités</h1>

  <pre>{JSON.stringify(entityById, null, 2)}</pre>
</main>
