<script setup lang="ts">
import { Bot, Bug, FileText, Layers, MessageSquare, Moon, Sun } from 'lucide-vue-next'

const colorMode = useColorMode()

function toggleColorMode() {
  colorMode.preference = colorMode.preference === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <aside class="flex flex-col border-r">
    <div class="border-b p-4">
      <Bot class="size-6" />
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

      <NuxtLink to="/document" active-class="[&>button]:bg-muted">
        <Button
          variant="ghost"
          size="icon"
        >
          <FileText class="size-5" />
        </Button>
      </NuxtLink>

      <DevOnly>
        <NuxtLink to="/debug" active-class="[&>button]:bg-muted">
          <Button
            variant="ghost"
            size="icon"
          >
            <Bug class="size-5" />
          </Button>
        </NuxtLink>
      </DevOnly>

      <Button
        variant="ghost"
        size="icon"
        class="mt-auto"
        @click="toggleColorMode"
      >
        <Moon v-if="colorMode.preference === 'dark'" class="size-5" />
        <Sun v-if="colorMode.preference === 'light'" class="size-5" />
      </Button>
    </nav>
  </aside>
</template>
