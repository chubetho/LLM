<script setup lang="ts">
const result = ref('')

const { open, onChange } = useFileDialog({
  accept: 'pdf/*',
})

const { status, embed } = useLLM()

onChange(async (fileList) => {
  if (!fileList)
    return

  const formData = new FormData()
  formData.set('file', fileList[0])
  const parseResult = await $fetch('/api/pdf', {
    method: 'POST',
    body: formData,
  })

  if (!parseResult)
    return

  const embeddings = await embed(parseResult)
  await $fetch('/api/embeddings', {
    method: 'POST',
    body: { value: embeddings[0], input: parseResult },
  })
})
</script>

<template>
  <main class="p-10">
    <Button type="button" @click="open">
      Choose file
    </Button>

    {{ status }}

    <div>
      {{ result }}
    </div>
  </main>
</template>
