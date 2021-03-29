<script context="module" lang="ts">
  // import type { LoadInput, LoadOutput } from "@sveltejs/kit/types.internal"

  // import { decomposition, walkDecomposition } from "$lib/decompositions"
  // import type { Situation } from "$lib/situations"

  // // See https://github.com/cbenz/openfisca-interactive/blob/master/waterfall.ipynb
  // const year = 2017
  // const variablesDecomposition = Object.fromEntries(
  //   [...walkDecomposition(decomposition)]
  //     .filter(
  //       (node) =>
  //         ![
  //           "aide_embauche_pme",
  //           "aide_premier_salarie",
  //           "allegement_fillon",
  //           "cotisations_employeur",
  //           "cotisations_salariales",
  //           "cout_du_travail",
  //           "crds_salaire",
  //           "credit_impot_competitivite_emploi",
  //           "csg_deductible_salaire",
  //           "csg_imposable_salaire",
  //           "irpp",
  //           "minima_sociaux",
  //           "ppa",
  //           "ppe",
  //           "prestations_sociales",
  //           "revenus_nets_du_travail",
  //           "rsa",
  //           "salaire_de_base",
  //           "salaire_imposable",
  //           "salaire_net",
  //           "salaire_super_brut",
  //           "salaire_super_brut_hors_allegements",
  //           "tehr",
  //         ].includes(node.code),
  //     )
  //     .map((node) => [node.code, { [year]: null }]),
  // )
  // const situation: Situation = {
  //   individus: {
  //     Claude: {
  //       salaire_de_base: {
  //         [year]: 20000,
  //       },
  //     },
  //     Dominique: {
  //       salaire_de_base: {
  //         [year]: 30000,
  //       },
  //     },
  //     Camille: {},
  //   },
  //   menages: {
  //     menage_1: {
  //       personne_de_reference: ["Claude"],
  //       conjoint: ["Dominique"],
  //       enfants: ["Camille"],
  //       ...variablesDecomposition,
  //     },
  //   },
  //   familles: {
  //     famille_1: {
  //       parents: ["Claude", "Dominique"],
  //       enfants: ["Camille"],
  //     },
  //   },
  //   foyers_fiscaux: {
  //     foyer_fiscal_1: {
  //       declarants: ["Claude", "Dominique"],
  //       personnes_a_charge: ["Camille"],
  //     },
  //   },
  // }

  // export async function load({ fetch }: LoadInput): Promise<LoadOutput> {
  //   const url = "https://fr.openfisca.org/api/latest/calculate"
  //   const res = await fetch(url, {
  //     body: JSON.stringify(situation, null, 2),
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     method: "POST",
  //   })

  //   if (!res.ok) {
  //     console.error(
  //       `Error ${res.status} while calculating at ${url}\n${JSON.stringify(
  //         situation,
  //         null,
  //         2,
  //       )}\n\n${await res.text()}`,
  //     )
  //     return {
  //       status: res.status,
  //       error: new Error(`Could not load ${url}`),
  //     }
  //   }
  //   return {
  //     props: {
  //       simulation: await res.json(),
  //     },
  //   }
  // }
</script>

<script lang="ts">
  import Sockette from "sockette"

  import { browser } from "$app/env"
  import { session } from "$app/stores"
  import { decomposition } from "$lib/decompositions"
  // import type { Simulation } from "$lib/simulations"
  import type { Situation } from "$lib/situations"

  // export let simulation: Simulation

  let results: { code: string; value: number[] }[] = []
  const year = 2017
  const situation: Situation = {
    individus: {
      Claude: {
        salaire_de_base: {
          [year]: 20000,
        },
      },
      Dominique: {
        salaire_de_base: {
          [year]: 30000,
        },
      },
      Camille: {},
    },
    menages: {
      menage_1: {
        personne_de_reference: ["Claude"],
        conjoint: ["Dominique"],
        enfants: ["Camille"],
      },
    },
    familles: {
      famille_1: {
        parents: ["Claude", "Dominique"],
        enfants: ["Camille"],
      },
    },
    foyers_fiscaux: {
      foyer_fiscal_1: {
        declarants: ["Claude", "Dominique"],
        personnes_a_charge: ["Camille"],
      },
    },
  }

  let webSocket: Sockette | undefined = undefined

  $: if (browser) {
    openWebSocket()
  }

  function openWebSocket() {
    webSocket = new Sockette(
      new URL("ws", $session.apiWebSocketBaseUrl).toString(),
      {
        // maxAttempts: 10,
        onmessage: (event) => {
          console.log("WebSocket message received:", event)
          const result = JSON.parse(event.data)
          if (result.error !== undefined) {
            console.log("Error:", result)
          } else {
            results = [...results, result]
          }
        },
        // onopen: (event) => console.log("[WebSocket] Connected!", event),
        // onreconnect: (event) =>
        //   console.log("[WebSocket] Reconnecting...", event),
        // onmaximum: (event) =>
        //   console.log("[WebSocket] Stop Attempting!", event),
        // onclose: (event) => console.log("[WebSocket] Closed!", event),
        // onerror: (event) => console.log("[WebSocket] Error:", event),
        // timeout: 5e3,
      },
    )
  }

  function submit() {
    results = []
    webSocket.send(
      JSON.stringify({
        decomposition,
        situation,
      }),
    )
    webSocket.send(
      JSON.stringify({
        calculate: true,
      }),
    )
  }
</script>

<pre>{JSON.stringify(situation)}</pre>

<button on:click={submit}>Simuler</button>

{#each results as result}
  <pre>{JSON.stringify(result)}</pre>
{/each}
<!-- <pre>{JSON.stringify(simulation, null, 2)}</pre> -->
