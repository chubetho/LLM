<template>
  <div class="h-screen flex justify-center items-center py-16">
    <div class="relative border rounded-lg overflow-hidden w-full h-full max-w-[95vw] 2xl:max-w-[80vw]">
      <div class="flex h-full w-full">
        <BaseAside />

        <main class="flex flex-col w-full [&>div]:h-full">
          <NuxtPage />
        </main>
      </div>
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
