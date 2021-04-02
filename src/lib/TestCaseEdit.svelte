<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"

  import type { Axis, Situation } from "$lib/situations"

  export let enfants = []
  export let individus = [
    {
      salaire_de_base: 18655,
    },
  ]
  export let vectorIndex = 0
  export let year = 2021

  let axes: Axis[][] = []
  let axisIndexByVariableCodeByEnfantIndex = new Map<
    number,
    Map<string, number>
  >()
  let axisIndexByVariableCodeByIndividuIndex = new Map<
    number,
    Map<string, number>
  >()
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

  function changeEnfantVariableValue(
    index: number,
    code: "age",
    value: string,
  ) {
    enfants = [...enfants]
    enfants[index] = { ...enfants[index], [code]: parseInt(value) }
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

  function changeIndividuVariableAxisIndex(
    index: number,
    code: "salaire_de_base",
    value: string,
  ) {
    let axisIndexByVariableCode = axisIndexByVariableCodeByIndividuIndex.get(
      index,
    )
    if (axisIndexByVariableCode === undefined) {
      axisIndexByVariableCode = new Map()
    } else {
      axisIndexByVariableCode = new Map(axisIndexByVariableCode)
    }
    axisIndexByVariableCode.set(code, parseInt(value))
    axisIndexByVariableCodeByIndividuIndex = new Map(
      axisIndexByVariableCodeByIndividuIndex,
    )
    axisIndexByVariableCodeByIndividuIndex.set(index, axisIndexByVariableCode)
    computeVectorIndex()
  }

  function changeIndividuVariableValue(
    index: number,
    code: "salaire_de_base",
    value: string,
  ) {
    individus = [...individus]
    individus[index] = { ...individus[index], [code]: parseInt(value) }
  }

  function computeAxes() {
    axes = []

    for (const individuIndex of individus.keys()) {
      const axisIndexByVariableCode = axisIndexByVariableCodeByIndividuIndex.get(
        individuIndex,
      )
      if (axisIndexByVariableCode === undefined) {
        continue
      }
      for (const code of axisIndexByVariableCode.keys()) {
        axes.push([
          {
            count: 100,
            index: individuIndex,
            max: 100000,
            min: 0,
            name: code,
            period: year.toString(),
          },
        ])
      }
    }

    for (const enfantIndex of enfants.keys()) {
      const axisIndexByVariableCode = axisIndexByVariableCodeByEnfantIndex.get(
        enfantIndex,
      )
      if (axisIndexByVariableCode === undefined) {
        continue
      }
      for (const code of axisIndexByVariableCode.keys()) {
        axes.push([
          {
            count: 100,
            index: individus.length + enfantIndex,
            max: 100000,
            min: 0,
            name: code,
            period: year.toString(),
          },
        ])
      }
    }

    dispatch("changeAxes", axes)
  }

  function computeVectorIndex() {
    let factor = 1
    vectorIndex = 0
    for (const parallelAxes of axes) {
      const axis = parallelAxes[0]
      const individuIndex = axis.index // TODO: handle non individus.
      if (individuIndex < individus.length) {
        vectorIndex +=
          factor *
          (axisIndexByVariableCodeByIndividuIndex
            .get(individuIndex)
            ?.get(axis.name) ?? 0)
      } else {
        const enfantIndex = individuIndex - individus.length
        vectorIndex +=
          factor *
          (axisIndexByVariableCodeByEnfantIndex
            .get(enfantIndex)
            ?.get(axis.name) ?? 0)
      }
      factor *= axis.count
    }
  }

  function toggleIndividuVariableAxis(index: number, code: "salaire_de_base") {
    let axisIndexByVariableCode = axisIndexByVariableCodeByIndividuIndex.get(
      index,
    )
    if (axisIndexByVariableCode === undefined) {
      axisIndexByVariableCode = new Map()
    } else {
      axisIndexByVariableCode = new Map(axisIndexByVariableCode)
    }
    if (axisIndexByVariableCode.get(code) === undefined) {
      axisIndexByVariableCode.set(code, 0)
    } else {
      axisIndexByVariableCode.delete(code)
    }
    axisIndexByVariableCodeByIndividuIndex = new Map(
      axisIndexByVariableCodeByIndividuIndex,
    )
    axisIndexByVariableCodeByIndividuIndex.set(index, axisIndexByVariableCode)

    computeAxes()
    computeVectorIndex()
  }

  function updateSituation(year, individus, enfants) {
    const situation: Situation = {
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
      dispatch("changeSituation", situation)
    } else {
      inited = true
      tick()
        .then(() => dispatch("changeSituation", situation))
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
        <input
          checked={axisIndexByVariableCodeByIndividuIndex
            .get(index)
            ?.get("salaire_de_base") !== undefined}
          on:click={() => toggleIndividuVariableAxis(index, "salaire_de_base")}
          type="checkbox"
        />
        Axe
      </label>
      {#if axisIndexByVariableCodeByIndividuIndex
        .get(index)
        ?.get("salaire_de_base") === undefined}
        <label>
          Salaire annuel de base
          <input
            min={0}
            on:change={({ target }) =>
              changeIndividuVariableValue(
                index,
                "salaire_de_base",
                target.value,
              )}
            step="1"
            type="number"
            value={individu.salaire_de_base}
          />
        </label>
      {:else}
        <label>
          Salaire annuel de base
          <input
            max="99"
            min="0"
            on:input={({ target }) =>
              changeIndividuVariableAxisIndex(
                index,
                "salaire_de_base",
                target.value,
              )}
            step="1"
            type="range"
            value={axisIndexByVariableCodeByIndividuIndex
              .get(index)
              ?.get("salaire_de_base") ?? 0}
          />
        </label>
      {/if}
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
            changeEnfantVariableValue(index, "age", target.value)}
          step="1"
          type="number"
          value={enfant.age}
        />
      </label>
    </li>
  {/each}
</ul>
