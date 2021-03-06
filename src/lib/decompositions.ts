export interface Decomposition {
  children?: Decomposition[]
  code: string
  delta?: number[]
  short_name: string
  values?: [number, number][]
}

export const decomposition: Decomposition = {
  code: "revenu_disponible",
  short_name: "Revenu disponible",
  children: [
    {
      code: "revenus_nets_du_travail",
      short_name: "Revenus nets",
      children: [
        {
          code: "salaire_net",
          short_name: "Salaire net",
          children: [
            {
              code: "salaire_imposable",
              short_name: "Salaire imposable",
              children: [
                {
                  code: "salaire_de_base",
                  short_name: "Salaire brut",
                  children: [
                    {
                      code: "salaire_super_brut_hors_allegements",
                      short_name: "Salaire super brut hors allègements",
                      children: [
                        {
                          code: "salaire_super_brut",
                          short_name: "Salaire super brut",
                          children: [
                            {
                              code: "cout_du_travail",
                              short_name: "Coût du travail",
                            },
                            {
                              code: "credit_impot_competitivite_emploi",
                              short_name: "CICE",
                            },
                            {
                              code: "aide_premier_salarie",
                              short_name: "Aide premier salarié",
                            },
                            {
                              code: "aide_embauche_pme",
                              short_name: "Aide PME",
                            },
                            { code: "tehr", short_name: "Taxe exceptionnelle" },
                          ],
                        },
                        { code: "allegement_fillon", short_name: "Fillon" },
                      ],
                    },
                    {
                      code: "cotisations_employeur",
                      short_name: "Cotisations employeur",
                    },
                  ],
                },
                {
                  code: "cotisations_salariales",
                  short_name: "Cotisations salariales",
                },
                {
                  code: "csg_deductible_salaire",
                  short_name: "CSG déductible",
                },
              ],
            },
            { code: "csg_imposable_salaire", short_name: "CSG imposable" },
            { code: "crds_salaire", short_name: "CRDS" },
          ],
        },
      ],
    },
    {
      code: "prestations_sociales",
      short_name: "Prestations sociales",
      children: [
        {
          code: "minima_sociaux",
          short_name: "Minima sociaux",
          children: [
            { code: "rsa", short_name: "RSA" },
            { code: "ppa", short_name: "PPA" },
          ],
        },
      ],
    },
    { code: "ppe", short_name: "PPE" },
    {
      code: "impots_directs",
      short_name: "Impôts directs",
      children: [{ code: "irpp", short_name: "Impôt sur le revenu" }],
    },
  ],
}

export function* walkDecomposition(
  decomposition: Decomposition,
  depthFirst = false,
): Generator<Decomposition, void, unknown> {
  if (!depthFirst) {
    yield decomposition
  }
  for (const child of decomposition.children ?? []) {
    yield* walkDecomposition(child, depthFirst)
  }
  if (depthFirst) {
    yield decomposition
  }
}
