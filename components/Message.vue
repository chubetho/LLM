<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

const props = defineProps<{
  message: Message
}>()
</script>

<template>
  <template v-if="props.message.content">
    <li
      v-if="props.message.role === 'assistant'"
      class="flex items-start"
    >
      <div class="size-9 bg-secondary rounded-full flex items-center justify-center mr-3">
        <Bot class="size-5" />
      </div>

      <div class="rounded-b-lg w-fit">
        <MDC :value="props.message.content" :tag="false" />
      </div>
    </li>

    <li
      v-else-if="props.message.role === 'system' && props.message.type !== 'hidden'"
      :class="props.message.type === 'file' ? 'self-end' : 'self-center'"
    >
      <div
        v-if="props.message.type === 'file'"
        class="rounded-b-lg w-fit bg-secondary rounded-lg px-3 py-1"
      >
        {{ props.message.name }}
      </div>

      <div v-else class="rounded-b-lg w-fit bg-secondary rounded-lg text-sm px-3 py-0.5 border border-primary">
        <MDC :value="props.message.content" :tag="false" />
      </div>
    </li>

    <li
      v-if="props.message.role === 'user'"
      class="self-end max-w-[75%]"
    >
      <div class="rounded-b-lg w-fit bg-secondary px-3 py-1 rounded-lg">
        <MDC :value="props.message.content" :tag="false" />
      </div>
    </li>
  </template>
</template>
