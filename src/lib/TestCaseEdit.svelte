<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"

  import type { Situation } from "$lib/situations"

  export let enfants = []
  export let individus = [
    {
      salaire_de_base: 18655,
    },
  ]
  export let year = 2021

  const dispatch = createEventDispatcher()
  let inited = false

  $: updateSituation(year, individus, enfants)

  function changeEnfantsCount(count: string): void {
    const enfantsCount = parseInt(count)
    if (enfantsCount === enfants.length) {
      return
    }
    enfants = enfants.slice(0, Math.min(enfants.length, enfantsCount))
    while (enfants.length < enfantsCount) {
      enfants.push({
        age: 1,
      })
    }
  }

  function changeEnfantVariable(index: number, name: "age", value: string) {
    enfants = [...enfants]
    enfants[index] = { ...enfants[index], [name]: parseInt(value) }
  }

  function changeIndividusCount(count: string): void {
    const individusCount = parseInt(count)
    if (individusCount === individus.length) {
      return
    }
    individus = individus.slice(0, Math.min(individus.length, individusCount))
    while (individus.length < individusCount) {
      individus.push({
        salaire_de_base: 0,
      })
    }
  }

  function changeIndividuVariable(
    index: number,
    name: "salaire_de_base",
    value: string,
  ) {
    individus = [...individus]
    individus[index] = { ...individus[index], [name]: parseInt(value) }
  }

  function updateSituation(year, individus, enfants) {
    // Remove variable when it is used in an axis.
    delete individus[0].salaire_de_base
    const situation: Situation = {
      axes: [
        [
          {
            count: 100,
            index: 0,
            max: 100000,
            min: 0,
            name: "salaire_de_base",
            period: year.toString(),
          },
        ],
      ],
      familles: {
        "Famille 1": {
          parents: individus.map((_individu, index) => `Individu ${index + 1}`),
          enfants: enfants.map((enfants, index) => `Enfant ${index + 1}`),
        },
      },
      foyers_fiscaux: {
        "Foyer fiscal 1": {
          declarants: individus.map(
            (_individu, index) => `Individu ${index + 1}`,
          ),
          personnes_a_charge: enfants.map(
            (enfants, index) => `Enfant ${index + 1}`,
          ),
        },
      },
      individus: Object.fromEntries([
        ...individus.map((individu, index) => [
          `Individu ${index + 1}`,
          {
            salaire_de_base: { [year]: individu.salaire_de_base },
          },
        ]),
        ...enfants.map((enfant, index) => [
          `Enfant ${index + 1}`,
          {
            age: { [`${year}-01`]: enfant.age },
          },
        ]),
      ]),
      menages: {
        "Ménage 1": {
          personne_de_reference: ["Individu 1"],
          conjoint: individus
            .slice(1)
            .map((_individu, index) => `Individu ${index + 2}`),
          enfants: enfants.map((enfants, index) => `Enfant ${index + 1}`),
        },
      },
    }
    if (inited) {
      dispatch("change", situation)
    } else {
      inited = true
      tick()
        .then(() => dispatch("change", situation))
        .catch((err) => console.error(err))
    }
  }
</script>

<label>
  Nombre d'individus
  <input
    max={2}
    min={1}
    on:change={({ target }) => changeIndividusCount(target.value)}
    step="1"
    type="number"
    value={individus.length}
  />
</label>

<ul>
  {#each individus as individu, index}
    <li>
      <label>
        Salaire annuel de base
        <input
          min={0}
          on:change={({ target }) =>
            changeIndividuVariable(index, "salaire_de_base", target.value)}
          step="1"
          type="number"
          value={individu.salaire_de_base}
        />
      </label>
    </li>
  {/each}
</ul>

<label>
  Nombre d'enfants
  <input
    max={20}
    min={0}
    on:change={({ target }) => changeEnfantsCount(target.value)}
    step="1"
    type="number"
    value={enfants.length}
  />
</label>

<ul>
  {#each enfants as enfant, index}
    <li>
      <label>
        Âge
        <input
          max={150}
          min={-1}
          on:change={({ target }) =>
            changeEnfantVariable(index, "age", target.value)}
          step="1"
          type="number"
          value={enfant.age}
        />
      </label>
    </li>
  {/each}
</ul>
