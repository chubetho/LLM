<script setup lang="ts">
import { Bot, Layers, MessageSquare } from 'lucide-vue-next'
</script>

<template>
  <aside class="flex flex-col border-r">
    <div class="border-b p-2">
      <Button variant="outline" size="icon">
        <Bot class="size-5" />
      </Button>
    </div>
    <nav class="grid gap-2 p-2">
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
    </nav>
  </aside>
</template>
