<script context="module" lang="ts">
    export async function load({ page, fetch, session, context }) {
      const url = "https://fr.openfisca.org/api/latest/calculate";
      const situation = {
        individus: {
          Claude: {
            salaire_de_base: {
              "2017": 20000,
            },
          },
          Dominique: {
            salaire_de_base: {
              "2017": 30000,
            },
          },
          Camille: {},
        },
        menages: {
          menage_1: {
            personne_de_reference: ["Claude"],
            conjoint: ["Dominique"],
            enfants: ["Camille"],
            revenu_disponible: {
              "2017": null,
            },
            impots_directs: {
              "2017": null,
            },
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
      };
      const res = await fetch(url, {
        body: JSON.stringify(situation, null, 2),
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
      });
  
      if (res.ok) {
        return {
          props: {
            simulation: await res.json(),
          },
        };
      }
  
      return {
        status: res.status,
        error: new Error(`Could not load ${url}`),
      };
    }
  </script>
  
  <script lang="ts">
    export let simulation: any;
  </script>
  
  <pre>{JSON.stringify(simulation, null, 2)}</pre>
  