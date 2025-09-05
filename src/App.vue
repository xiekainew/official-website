<template>
  <div id="app">
    {{ id }}
    <router-view title="route" age="12"></router-view>
  </div>
</template>

<script setup>
import {useId, ref} from 'vue'
const id = ref(useId())

// myUndefinedFunction();

</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
