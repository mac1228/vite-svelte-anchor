<script lang="ts">
  let count: number = 0;
  const increment = () => {
    count += 1;
  };
</script>

<button on:click={increment}>
  click me: {count}
</button>

<style>
  button {
    border: solid black 2px;
    margin: 10px 0;
  }
</style>
