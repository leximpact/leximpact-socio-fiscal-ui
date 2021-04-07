<script lang="ts">
  import { session } from "$app/stores"

  $: title = $session.title
</script>

<svelte:head>
  <title>{title}</title>
</svelte:head>

<main>
  <h1>{title}</h1>

  <h2>Tests de l'API OpenFisca</h2>
  <ul>
    <li><a href="/calculations">Calculs</a></li>
    <li><a href="/entities">Entités</a></li>
    <li><a href="/parameters">Paramètres</a></li>
    <li><a href="/variables">Variables</a></li>
  </ul>

  <h2>Documentation</h2>
  <ul>
    <li><a href="/spec">Documentation de l'API</a></li>
    <li><a href="/storybook">Storybook (design des éléments visuels)</a></li>
  </ul>
</main>
