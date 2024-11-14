<script setup lang="ts">
import { ChevronDown, Upload } from 'lucide-vue-next'

const emit = defineEmits<{
  parsed: [title: string, content: string]
}>()

const data = shallowRef<{ title: string, content: string }>()

const { open, files } = useFileDialog({
  accept: 'application/pdf',
  multiple: false,
})

const file = computed(() => {
  if (!files.value || !files.value.length)
    return

  return files.value[0]
})

watch(file, async (v) => {
  if (!v)
    return

  const formData = new FormData()
  formData.append('data', v)

  const content = await $fetch('/api/pdf', {
    method: 'POST',
    body: formData,
  })

  data.value = { title: v.name, content: content?.toString() ?? '' }
  emit('parsed', data.value.title, data.value.content)
})
</script>

<template>
  <div class="space-y-8">
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

    <div v-if="data" class="bg-secondary rounded-lg p-4">
      <label class="flex items-center peer" for="file_title">
        <input id="file_title" type="checkbox" class="peer sr-only" checked>
        <span class="underline peer-checked:no-underline underline-offset-4">
          {{ data.title }}
        </span>
        <span class="peer-checked:-rotate-90 transition-transform ml-auto">
          <ChevronDown class="size-5" />
        </span>
      </label>

      <div class="mt-4 overflow-y-auto max-h-32 peer-has-[input:checked]:mt-0 peer-has-[input:checked]:max-h-0 transition-all">
        <p class="text-pretty text-sm text-justify pr-4">
          {{ data.content }}
        </p>
      </div>
    </div>
  </div>
</template>
