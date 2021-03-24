<script lang="ts">
    let color = "text-red-500"
    function setColor(){ color = "text-blue-500" }
    let valeur = 3
</script>

COUCOU

<button class="block border m-2 {color}" on:click={() => setColor()}>CLIC !</button>
<input type="number" bind:value={valeur}/>
<p>{valeur}</p>
