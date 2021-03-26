<script context="module" lang="ts">
  import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
    const url = "https://fr.openfisca.org/api/latest/variables"
    const res = await fetch(url)

    if (res.ok) {
      return {
        props: {
          variableById: await res.json(),
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
  export let variableById: unknown
</script>

<pre>{JSON.stringify(variableById, null, 2)}</pre>
