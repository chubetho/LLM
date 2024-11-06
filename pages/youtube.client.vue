<script setup lang="ts">
import { Loader, Youtube } from 'lucide-vue-next'

const url = ref('')

const imgUrl = computed(() => {
  const parsed = URL.parse(url.value)
  if (!parsed)
    return
  const id = parsed.searchParams.get('v')
  if (!id)
    return
  return `https://i.ytimg.com/vi/${id}/hq720.jpg`
})

const { data, status, execute } = await useFetch('/api/youtube/transcripts', {
  method: 'POST',
  body: { url: url.value },
  immediate: false,
})

const isProcessing = ref(false)
const output = ref('')

function submit() {
  const isValid = URL.canParse(url.value)
  if (!isValid)
    return

  isProcessing.value = true
  execute()
}

const canGenerateSet = ref(false)
watch(data, (v) => {
  if (!v || status.value !== 'success')
    return

  abort()
  output.value = ''
  chatStream(`Please summarize the following text in a clear and concise manner, maintaining the main points and critical information. Use proper formatting to organize the summary, with each key point or section on a new line. Include headings or bullet points where necessary, and use line breaks to ensure readability. Keep the tone informative and neutral. Aim for approximately 20% of the original text's length, unless otherwise specified.
  ${v.content}`, (o) => {
    if (o === '__end__') {
      isProcessing.value = false
      output.value = output.value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replaceAll('*', '')
      canGenerateSet.value = true
      return
    }

    output.value += o
  }, { endSymbol: true })
})

const isGenerating = ref(false)
async function generateSet() {
  if (!output.value)
    return

  isGenerating.value = true

  const response = await chat(
    `Using this summary ${JSON.stringify(output.value)} to generate, meaningful cards in JSON format as an array of objects with {term: string, def: string}.  ensure each new card is unique.`,
    { format: 'json' },
  )

  isGenerating.value = false

  useState('set_from_yt', () => ({ title: data.value?.title, cards: JSON.parse(response).cards }))
  navigateTo('/insert')
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summarize youtube video
    </template>

    <div>
      <div class="p-4 grid grid-cols-5 gap-10" @submit.prevent="submit">
        <div class="col-span-3">
          <Label class="mb-1" for="yt_url">url</Label>
          <Input
            id="yt_url"
            v-model="url"
            class="mb-2"
            placeholder="https://www.youtube.com/watch?v=<id>"
          />

          <div class="flex item-center gap-2">
            <Button
              size="sm"
              :disabled="isProcessing"
              @click="submit"
            >
              <template v-if="isProcessing">
                <div class="flex gap-1 items-center">
                  <Loader class="animate-spin size-4" />
                  processing
                </div>
              </template>
              <template v-else>
                process
              </template>
            </Button>

            <Button
              size="sm"
              :disabled="!canGenerateSet || isGenerating"
              @click="generateSet"
            >
              <template v-if="isGenerating">
                <div class="flex gap-1 items-center">
                  <Loader class="animate-spin size-4" />
                  generating
                </div>
              </template>
              <template v-else>
                generate set
              </template>
            </Button>
          </div>
        </div>

        <div class="border col-span-2 rounded-lg overflow-hidden">
          <AspectRatio :ratio="16 / 9">
            <img v-if="imgUrl" :src="imgUrl" alt="thumbnail">
            <div v-else class="w-full h-full bg-secondary flex items-center justify-center">
              <Youtube class="size-16 stroke-1" />
            </div>
          </AspectRatio>
        </div>
      </div>

      <div v-html="output" />
    </div>
  </BasePageWrap>
</template>
