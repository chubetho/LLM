<script setup lang="ts">
import { Bot } from 'lucide-vue-next'

const props = defineProps<{
  role: string
  value?: string
}>()

const containerClass = computed(() => {
  switch (props.role) {
    case 'user':{
      return 'self-end'
    }
    case 'system':{
      return 'self-center'
    }
    case 'assistant':{
      return 'flex items-start'
    }
    default: return ''
  }
})

const contentClass = computed(() => {
  switch (props.role) {
    case 'user':{
      return 'bg-secondary px-3 py-1'
    }
    case 'system':{
      return 'bg-secondary text-sm px-2 py-0.5'
    }
    case 'assistant':{
      return ''
    }
    default: return ''
  }
})
</script>

<template>
  <li v-if="props.value" class="" :class="[containerClass]">
    <div
      v-if="props.role === 'assistant'"
      class="size-9 bg-secondary rounded-full flex items-center justify-center mr-3"
    >
      <Bot class="size-5" />
    </div>

    <div class="rounded-lg w-fit" :class="[contentClass]">
      <MDC :value="props.value" :tag="false" />
    </div>
  </li>
</template>
