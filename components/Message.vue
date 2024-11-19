<script setup lang="ts">
const props = defineProps<{
  role: 'user' | 'assistent' | 'system'
}>()

const styleClass = computed(() => {
  switch (props.role) {
    case 'user':{
      return 'bg-primary text-primary-foreground self-end'
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
  <li class="px-3 py-2 rounded-lg w-fit" :class="[styleClass]">
    <slot />
  </li>
</template>
