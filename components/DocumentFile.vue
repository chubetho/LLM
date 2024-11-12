<script setup lang="ts">
import { Upload } from 'lucide-vue-next'

const { open, files } = useFileDialog({
  accept: 'application/pdf',
  multiple: false,
})

const file = computed(() => {
  if (!files.value || !files.value.length)
    return

  return files.value[0]
})
const summary = ref('')

watch(file, async (v) => {
  if (!v)
    return

  const formData = new FormData()
  formData.append('data', v)

  const result = await $fetch('/api/pdf', {
    method: 'POST',
    body: formData,
  })
  chatStream(`summarize this ${result}`, o => summary.value += o)
})
</script>

<template>
  <div>
    <button class="border w-full rounded-lg h-40 flex items-center justify-center flex-col hover:border-primary transition-colors" @click="open()">
      <Upload class="size-8 mb-2 stroke-[1.5px]" />
      <p class="text-xl mb-1 font-light">
        upload file here
      </p>
      <p class="text-sm text-primary/50">
        only pdf is supported
      </p>
    </button>
  </div>

  <div v-if="file">
    <p>{{ file.name }}</p>
    <p>{{ summary }}</p>
  </div>
</template>
