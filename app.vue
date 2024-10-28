<script lang="ts">
import './assets/tailwind.css'
</script>

<template>
  <div class="h-screen flex justify-center items-center">
    <div class="relative border rounded-lg overflow-hidden w-full h-full max-w-[80vw] max-h-[80vh]">
      <div class="flex h-full w-full">
        <aside class="relative z-20 flex flex-col border-r">
          <div class="border-b p-2">
            <Button variant="outline" size="icon" aria-label="Home">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-bot size-5"><path d="M12 8V4H8" /><rect width="16" height="12" x="4" y="8" rx="2" /><path d="M2 14h2" /><path d="M20 14h2" /><path d="M15 13v2" /><path d="M9 13v2" /></svg>
            </Button>
          </div>
          <nav class="grid gap-1 p-2">
            <Button
              variant="ghost"
              size="icon"
              class="rounded-lg"
              aria-label="Playground"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-message-square size-5"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" /></svg>
            </Button>
          </nav>
        </aside>

        <div class="flex flex-col w-full">
          <header class="z-10 flex h-[62px] items-center gap-1 border-b bg-background px-4">
            <h1 class="text-xl font-semibold">
              Playground
            </h1>
          </header>
          <main class="h-full p-4">
            <NuxtPage />
          </main>
        </div>
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
