<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

const props = defineProps<{
  message: Message
}>()

const containerClass = computed(() => {
  switch (props.message.role) {
    case 'user':{
      return 'self-end max-w-[75%]'
    }
    case 'system':{
      if (props.message.type === 'file')
        return 'self-end'
      return 'self-center'
    }
    case 'assistant':{
      return 'flex items-start'
    }
    default: return ''
  }
})

const contentClass = computed(() => {
  switch (props.message.role) {
    case 'user':{
      return 'bg-secondary px-3 py-1 rounded-lg'
    }
    case 'system':{
      if (props.message.type === 'file')
        return 'bg-secondary rounded-lg px-3 py-1'
      return 'bg-secondary rounded-lg text-sm px-2 py-0.5'
    }
    case 'assistant':{
      return ''
    }
    default: return ''
  }
})
</script>

<template>
  <li v-if="props.message.content" class="" :class="[containerClass]">
    <template v-if="props.message.role === 'system' && props.message.type === 'file'">
      <div class="rounded-b-lg w-fit" :class="[contentClass]">
        {{ props.message.name }}
      </div>
    </template>

    <template v-else>
      <div
        v-if="props.message.role === 'assistant'"
        class="size-9 bg-secondary rounded-full flex items-center justify-center mr-3"
      >
        <Bot class="size-5" />
      </div>

      <div class="rounded-b-lg w-fit" :class="[contentClass]">
        <MDC :value="props.message.content" :tag="false" />
      </div>
    </template>
  </li>
</template>
