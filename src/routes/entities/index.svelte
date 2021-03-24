<script context="module" lang="ts">
  export async function load({ page, fetch, session, context }) {
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
  export let entityById: any
</script>

<pre>{JSON.stringify(entityById, null, 2)}</pre>
