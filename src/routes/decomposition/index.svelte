<script context="module" lang="ts">
    export async function load({ page, fetch, session, context }) {
      const url = "https://fr.openfisca.org/api/latest/calculate";
      const situation = {
        individus: {
          Claude: {
            salaire_net_a_payer: {
              // Salaire de la fiche de paie
              "2021-01": null
            },
            crds_salaire: {
              "2021-01": null
            },
            csg_imposable_salaire: {
              "2021-01": null
            },
            salaire_imposable: {
              "2021-01": null
            },
            csg_deductible_salaire: {
              "2021-01": null
            },
            cotisations_salariales: {
              "2021-01": null
            },
            salaire_de_base: {
              "2021-01": 18655/12,
              "2021-02": 18655/12,
              "2021-03": 18655/12,
              "2021-04": 18655/12,
              "2021-05": 18655/12,
              "2021-06": 18655/12,
              "2021-07": 18655/12,
              "2021-08": 18655/12,
              "2021-09": 18655/12,
              "2021-10": 18655/12,
              "2021-11": 18655/12,
              "2021-12": 18655/12,
            },
            cotisations_employeur: {
              "2021-01": null
            },
            allegement_fillon: {
              // Allègement de cotisations patronales sur les bas salaires
              "2021-01": null
            }, 
            salaire_super_brut: {
              "2021-01": null
            },
          },
          Dominique: {
            salaire_net_a_payer: {
              "2021-01": null
            },
            crds_salaire: {
              "2021-01": null
            },
            csg_imposable_salaire: {
              "2021-01": null
            },
            salaire_imposable: {
              "2021-01": null
            },
            csg_deductible_salaire: {
              "2021-01": null
            },
            cotisations_salariales: {
              "2021-01": null
            },
            salaire_de_base: {
              "2021-01": 30000/12,
              "2021-02": 30000/12,
              "2021-03": 30000/12,
              "2021-04": 30000/12,
              "2021-05": 30000/12,
              "2021-06": 30000/12,
              "2021-07": 30000/12,
              "2021-08": 30000/12,
              "2021-09": 30000/12,
              "2021-10": 30000/12,
              "2021-11": 30000/12,
              "2021-12": 30000/12,
            },
            cotisations_employeur: {
              "2021-01": null
            },
            allegement_fillon: {
              "2021-01": null
            },
            salaire_super_brut: {
              "2021-01": null
            },
          },
          Noa: {
            age: {
              "2021-01": 1
            }
          },
          Camille: {
            age: {
              "2021-01": 15
            }
          },
        },
        menages: {
          menage_1: {
            personne_de_reference: ["Claude"],
            conjoint: ["Dominique"],
            enfants: ["Camille", "Noa"],
            revenu_disponible: {
              "2021": null
            },
            impots_directs: {
              "2021": null
            },
          },
        },
        familles: {
          famille_1: {
            parents: ["Claude", "Dominique"],
            enfants: ["Camille", "Noa"],
            rsa: {
              "2021-01": null,
              "2021-02": null
            },
            af: {
              "2021-01": null,
              "2021-02": null
            },
            cf: {
              "2021-01": null,
              "2021-02": null
            },
          },
        },
        foyers_fiscaux: {
          foyer_fiscal_1: {
            declarants: ["Claude", "Dominique"],
            personnes_a_charge: ["Camille", "Noa"],
            irpp: {
              "2021": null
            },
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
