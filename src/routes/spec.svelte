<script context="module" lang="ts">
  export async function load({ page, fetch, session, context }) {
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
  export let spec: any
</script>

<pre>{JSON.stringify(spec, null, 2)}</pre>
