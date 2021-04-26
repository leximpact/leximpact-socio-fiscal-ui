<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types/page"

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const url = "https://fr.openfisca.org/api/latest/spec"
    const res = await fetch(url)

    if (res.ok) {
      return {
        props: {
          spec: await res.json(),
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

  export let spec: unknown
</script>

<svelte:head>
  <title>Documentation de l'API | {$session.title}</title>
</svelte:head>

<main>
  <h1>Documentation de l'API</h1>

  <pre>{JSON.stringify(spec, null, 2)}</pre>
</main>
