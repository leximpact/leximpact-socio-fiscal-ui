<script context="module" lang="ts">
	export async function load({ page, fetch, session, context }) {
		const url = "https://fr.openfisca.org/api/latest/variables";
		const res = await fetch(url);

		if (res.ok) {
			return {
				props: {
					variableById: await res.json()
				}
			};
		}

		return {
			status: res.status,
			error: new Error(`Could not load ${url}`)
		};
	}
</script>

<script lang="ts">
  export let variableById: any
</script>

<pre>{JSON.stringify(variableById, null, 2)}</pre>