<script lang="ts">
  import Counter from "$lib/Counter.svelte";
</script>

<style lang="postcss">
  :root {
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Oxygen,
      Ubuntu, Cantarell, "Open Sans", "Helvetica Neue", sans-serif;
  }

  main {
    @apply text-center;
    @apply p-4;
    @apply mx-auto;
  }

  h1 {
    @apply text-red-600;
    @apply uppercase;
    @apply text-6xl;
    @apply font-thin;
    @apply leading-tight;
    @apply my-16 mx-auto;
    @apply max-w-xs;
  }

  p {
    @apply max-w-xs;
    @apply my-8 mx-auto;
    @apply leading-snug;
  }

  @screen sm {
    h1 {
      @apply max-w-none;
    }

    p {
      @apply max-w-none;
    }
  }
</style>

<main>
  <h1>Simulateur socio-fiscal Leximpact</h1>

  <Counter />

  <h2>Usage</h2>
  <ul>
    <li><a href="calculations">Calculations</a></li>
    <li><a href="entities">Entities</a></li>
    <li><a href="parameters">Parameters</a></li>
    <li><a href="variables">Variables</a></li>
  </ul>

  <h2>Documentation</h2>
  <ul>
    <li><a href="spec">API documentation</a></li>
  </ul>
</main>
