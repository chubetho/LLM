<script setup lang="ts">
const props = defineProps<{
  role: string
  value?: string
}>()

const styleClass = computed(() => {
  switch (props.role) {
    case 'user':{
      return 'bg-secondary self-end'
    }
    case 'system':{
      return 'bg-secondary self-center'
    }
    case 'assistent':{
      return ''
    }
    default: return ''
  }
})
</script>

<template>
  <li v-if="props.value" class="px-3 py-2 rounded-lg w-fit" :class="[styleClass]">
    <MDC :value="props.value" :tag="false" />
  </li>
</template>
