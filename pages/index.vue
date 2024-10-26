<script setup lang="ts">
const result = ref('')

const { open, onChange } = useFileDialog({
  accept: 'pdf/*',
})

const { status, embed, chat } = useLLM()

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
  await $fetch('/api/embeddings/insert', {
    method: 'POST',
    body: { value: embeddings[0], input: parseResult },
  })
})

const question = ref('Was ist die Aufgabe 1')
async function ask() {
  const embeddings = await embed(question.value)
  const data = await $fetch('/api/embeddings/find', {
    method: 'POST',
    body: { value: embeddings[0] },
  })

  const prompt = `Context:\n${data.map(d => d.input).join('\n')}\n\nQuery: ${question.value}\nAnswer:`
  const result = await chat(prompt)

  console.log(result)
}
</script>

<template>
  <main class="p-10">
    <div>
      <Button type="button" @click="open">
        Choose file
      </Button>

      {{ status }}

      <div>
        {{ result }}
      </div>
    </div>

    <div>
      <p>{{ question }}</p>
      <Button @click="ask">
        Ask
      </Button>
    </div>
  </main>
</template>
