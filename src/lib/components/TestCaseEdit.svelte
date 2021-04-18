<script lang="ts">
  import { createEventDispatcher, tick } from "svelte"

  import type { Axis, Situation } from "$lib/situations"

  interface AxisDescription {
    code: string // code of variable used for axis
    index: number // index of adulte or index of enfant used for axis
    isEnfant: boolean
  }

  export let adultes = [
    {
      salaire_de_base: 18655,
    },
  ]
  export let enfants = []
  export let vectorIndex = 0
  export let year = 2021

  let axis: Axis | null = null
  let axisDescription: AxisDescription | null = null
  const dispatch = createEventDispatcher()
  const adulteVariablesCode = ["salaire_de_base"]
  const enfantVariablesCode = ["age"]
  let inited = false
  let stepValue
  const variableDefinitionByCode = {
    age: {
      allowSlider: true,
      label: "Âge",
      max: 150,
      min: -1,
    },
    salaire_de_base: {
      allowSlider: true,
      label: "Salaire brut",
      max: 100_000,
      min: 0,
    },
  }

  $: dispatch("changeVectorIndex", vectorIndex)

  $: updateSituation(year, adultes, enfants)

  function changeAdultesCount(count: string): void {
    const adultesCount = parseInt(count)
    if (adultesCount === adultes.length) {
      return
    }
    adultes = adultes.slice(0, Math.min(adultes.length, adultesCount))
    while (adultes.length < adultesCount) {
      adultes.push({
        salaire_de_base: 0,
      })
    }
  }

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

  function changeVariableValue(
    isEnfant: boolean,
    index: number,
    code: string,
    value: string,
  ) {
    let persons
    if (isEnfant) {
      enfants = [...enfants]
      persons = enfants
    } else {
      adultes = [...adultes]
      persons = adultes
    }
    persons[index] = { ...persons[index], [code]: parseInt(value) }
  }

  function computeAxis() {
    axis =
      axisDescription === null
        ? null
        : {
            count: 100,
            index:
              axisDescription.index +
              (axisDescription.isEnfant ? adultes.length : 0),
            max: 100 * stepValue,
            min: 0,
            name: axisDescription.code,
            period: year.toString(),
          }

    dispatch("changeAxes", axis === null ? [] : [[axis]])
  }

  function getVariableValue(
    isEnfant: boolean,
    index: number,
    code: string,
  ): number {
    const persons = isEnfant ? enfants : adultes
    const person = persons[index]
    return person[code]
  }

  function isAxis(
    axisDescription: AxisDescription | null,
    isEnfant: boolean,
    index: number,
    code: string,
  ): boolean {
    return (
      axisDescription !== null &&
      axisDescription.isEnfant === isEnfant &&
      axisDescription.index === index &&
      axisDescription.code === code
    )
  }

  function* iterVariablesDefinition(isEnfant: boolean) {
    const codes = isEnfant ? enfantVariablesCode : adulteVariablesCode
    for (const code of codes) {
      yield {
        code,
        ...variableDefinitionByCode[code],
      }
    }
  }

  function setVariableValue(
    isEnfant: boolean,
    index: number,
    code: string,
    value: number,
  ): void {
    const persons = isEnfant ? enfants : adultes
    const person = persons[index]
    person[code] = value
  }

  function toggleAxis(isEnfant: boolean, index: number, code: string) {
    if (isAxis(axisDescription, isEnfant, index, code)) {
      axisDescription = null
      setVariableValue(
        isEnfant,
        index,
        code,
        Math.round(stepValue * vectorIndex),
      )
      stepValue = 0
      vectorIndex = 0
    } else {
      if (axisDescription !== null) {
        setVariableValue(
          axisDescription.isEnfant,
          axisDescription.index,
          axisDescription.code,
          Math.round(stepValue * vectorIndex),
        )
      }
      axisDescription = {
        code,
        index,
        isEnfant,
      }
      const { max, min } = variableDefinitionByCode[code]
      const defaultStepValue = (max - min) / 100
      const value = getVariableValue(isEnfant, index, code)
      vectorIndex = Math.ceil(value / defaultStepValue)
      stepValue = vectorIndex === 0 ? defaultStepValue : value / vectorIndex
    }

    computeAxis()
  }

  function updateSituation(year, adultes, enfants) {
    const situation: Situation = {
      familles: {
        "Famille 1": {
          parents: adultes.map((_adulte, index) => `Adulte ${index + 1}`),
          enfants: enfants.map((enfants, index) => `Enfant ${index + 1}`),
        },
      },
      foyers_fiscaux: {
        "Foyer fiscal 1": {
          declarants: adultes.map((_adulte, index) => `Adulte ${index + 1}`),
          personnes_a_charge: enfants.map(
            (enfants, index) => `Enfant ${index + 1}`,
          ),
        },
      },
      individus: Object.fromEntries([
        ...adultes.map((adulte, index) => [
          `Adulte ${index + 1}`,
          {
            salaire_de_base: { [year]: adulte.salaire_de_base },
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
          personne_de_reference: ["Adulte 1"],
          conjoint: adultes
            .slice(1)
            .map((_adulte, index) => `Adulte ${index + 2}`),
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
  Nombre d'adultes
  <input
    max={2}
    min={1}
    on:change={({ target }) => changeAdultesCount(target.value)}
    step="1"
    type="number"
    value={adultes.length}
  />
</label>

<ul>
  {#each adultes as _adulte, index}
    <li>
      {#each [...iterVariablesDefinition(false)] as { allowSlider, code, label, max, min }}
        {#if allowSlider && isAxis(axisDescription, false, index, code)}
          <label>
            {label}
            <input
              class="mt-2 mx-2"
              max="99"
              min="0"
              step="1"
              type="range"
              bind:value={vectorIndex}
            />
          </label>
          <span class="leading-6 px-3 py-2 text-base"
            >{Math.round(vectorIndex * stepValue)}</span
          >
        {:else}
          <label>
            {label}
            <input
              {max}
              {min}
              on:change={({ target }) =>
                changeVariableValue(false, index, code, target.value)}
              step="1"
              type="number"
              value={getVariableValue(false, index, code)}
            />
          </label>
        {/if}
        {#if allowSlider}
          <label>
            <input
              checked={isAxis(axisDescription, false, index, code)}
              on:click={() => toggleAxis(false, index, code)}
              type="radio"
            />
            Faire varier
          </label>
        {/if}
      {/each}
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
  {#each enfants as _enfant, index}
    <li>
      {#each [...iterVariablesDefinition(true)] as { allowSlider, code, label, max, min }}
        {#if allowSlider && isAxis(axisDescription, true, index, code)}
          <label>
            {label}
            <input
              class="mt-2 mx-2"
              max="99"
              min="0"
              step="1"
              type="range"
              bind:value={vectorIndex}
            />
          </label>
        {:else}
          <label>
            {label}
            <input
              {max}
              {min}
              on:change={({ target }) =>
                changeVariableValue(true, index, code, target.value)}
              step="1"
              type="number"
              value={getVariableValue(true, index, code)}
            />
          </label>
        {/if}
        {#if allowSlider}
          <label>
            <input
              checked={isAxis(axisDescription, true, index, code)}
              on:click={() => toggleAxis(true, index, code)}
              type="radio"
            />
            Faire varier
          </label>
        {/if}
      {/each}
    </li>
  {/each}
</ul>
