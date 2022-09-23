<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button
  class="p-2 hover:border-purple-500 focus:outline-purple-800 focus-visible:outline-purple-800 cursor-pointer rounded-lg"
  on:click={increment}
>
  click me: {count}
</button>

<style>
  button {
    border: solid black 2px;
    margin: 10px 0;
  }
</style>
