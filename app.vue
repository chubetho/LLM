<script lang="ts">
import './assets/tailwind.css'
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="relative border rounded-lg overflow-hidden w-full h-full max-w-[80vw] max-h-[90vh]">
      <NuxtPage />
    </div>
  </div>
</template>

<style>
html,
body,
#__nuxt {
  height: 100vh;
  margin: 0;
  padding: 0;
}
</style>
