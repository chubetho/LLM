<script setup lang="ts">
const props = defineProps<{
  input: string
}>()
</script>

<template>
  <div class="space-y-4">
    <MDC :value="props.input" :tag="false" />
  </div>
</template>
