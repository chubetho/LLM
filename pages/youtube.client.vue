<script setup lang="ts">
import { Loader, Youtube } from 'lucide-vue-next'
import Separator from '~/components/ui/separator/Separator.vue'

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

const data = shallowRef<{ title: string, content: string }>()
const isProcessing = ref(false)
const output = ref('')

async function process() {
  const isValid = URL.canParse(url.value)
  if (!isValid)
    return

  isProcessing.value = true
  data.value = await $fetch('/api/youtube', {
    method: 'POST',
    body: { url: url.value },
  })
  if (!data.value)
    return

  abort()

  output.value = ''
  chatStream(
    `Please summarize the following text in a clear and concise manner, focusing on the main points and critical information. Keep the tone informative and neutral. Aim for approximately 20% of the original text's length, unless otherwise specified. Use proper formatting to organize the summary, with each key point or section on a new line. Include headings or bullet points where necessary, and use line breaks to ensure readability:
  ${data.value.content}`,
    (outputText) => {
      if (outputText === '__end__') {
        isProcessing.value = false
        output.value = output.value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replaceAll('*', '')
        return
      }
      output.value += outputText
    },
    { endSymbol: true },
  )
}

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

const isSaving = ref(false)
async function saveDocument() {
  isSaving.value = true
  isSaving.value = false
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summarize youtube video
    </template>

    <div>
      <div class="p-4 grid grid-cols-5 gap-10" @submit.prevent="process">
        <div class="col-span-3">
          <div class="space-y-10">
            <div>
              <Label class="mb-1" for="yt_url">url</Label>

              <Input
                id="yt_url"
                v-model="url"
                class="mb-2"
                placeholder="https://www.youtube.com/watch?v=<id>"
              />

              <Button
                size="sm"
                :disabled="isProcessing"
                @click="process"
              >
                <template v-if="isProcessing">
                  <div class="flex gap-1 items-center">
                    <Loader class="animate-spin size-4" />
                    processing
                  </div>
                </template>
                <template v-else>
                  process video
                </template>
              </Button>
            </div>

            <div v-if="data?.title" class="border rounded-lg p-4 bg-secondary">
              <Label class="mb-1">title</Label>
              <p>{{ data?.title }}</p>
            </div>
          </div>
        </div>

        <div class="border col-span-2 rounded-lg overflow-hidden">
          <AspectRatio :ratio="16 / 9">
            <img v-if="imgUrl" :src="imgUrl" alt="thumbnail">
            <div v-else class="w-full h-full bg-secondary flex items-center justify-center">
              <Youtube class="size-16 stroke-1 opacity-80" />
            </div>
          </AspectRatio>
        </div>
      </div>

      <template v-if="output">
        <div
          v-if="output && !isProcessing"
          class="flex justify-center item-center gap-2 mt-4 mb-6"
        >
          <Button
            size="sm"
            :disabled="isGenerating"
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

          <Button
            size="sm"
            :disabled="isSaving"
            @click="saveDocument"
          >
            <template v-if="isGenerating">
              <div class="flex gap-1 items-center">
                <Loader class="animate-spin size-4" />
                saving
              </div>
            </template>
            <template v-else>
              save document
            </template>
          </Button>
        </div>

        <div class="border p-4 rounded-lg">
          <p class="pb-8 text-pretty text-justify" v-html="output" />
        </div>
      </template>
    </div>
  </BasePageWrap>
</template>
