<script setup lang="ts">
import { Layers, MessageSquare, Moon, Sun, Youtube } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <aside class="flex flex-col border-r">
    <div class="border-b p-2">
      <Button
        variant="ghost"
        size="icon"
        @click="toggleColorMode"
      >
        <Moon v-if="colorMode.preference === 'dark'" class="size-5" />
        <Sun v-if="colorMode.preference === 'light'" class="size-5" />
      </Button>
    </div>
    <nav class="flex flex-col h-full gap-2 p-2">
      <NuxtLink to="/" active-class="[&>button]:bg-muted">
        <Button
          variant="ghost"
          size="icon"
        >
          <Layers class="size-5" />
        </Button>
      </NuxtLink>

      <NuxtLink to="/chat" active-class="[&>button]:bg-muted">
        <Button
          variant="ghost"
          size="icon"
        >
          <MessageSquare class="size-5" />
        </Button>
      </NuxtLink>

      <NuxtLink to="/youtube" active-class="[&>button]:bg-muted">
        <Button
          variant="ghost"
          size="icon"
        >
          <Youtube class="size-5" />
        </Button>
      </NuxtLink>
    </nav>
  </aside>
</template>
