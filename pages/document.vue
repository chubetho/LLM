<script setup lang="ts">
import { Loader } from 'lucide-vue-next'

const data = shallowRef<{ title: string, content: string }>()

const output = ref('')
const outputEl = ref<HTMLElement>()

const processState = ref<'unprocess' | 'processing' | 'processed'>('unprocess')

const isGenerating = ref(false)
async function generateSet() {
  if (!output.value)
    return

  isGenerating.value = true

  const response = await chat(
    `Using this summary ${JSON.stringify(output.value)} to generate, meaningful cards in JSON format as an array of objects with {term: string, def: string}. ensure each new card is unique.`,
    { format: 'json' },
  )

  isGenerating.value = false

  useState('set_from_yt', () => ({ title: data.value?.title, cards: JSON.parse(response).cards }))
  navigateTo('/insert')
}

const savingState = ref<'unsave' | 'saving' | 'saved'>('unsave')
async function saveDocument() {
  const textContent = outputEl.value?.textContent
  if (!textContent)
    return

  savingState.value = 'saving'

  const embedding = await embed(textContent)

  await $fetch('/api/docs', {
    method: 'POST',
    body: {
      contents: textContent,
      embedding,
    },
  })

  savingState.value = 'saved'
}

function process() {
  abort()

  output.value = ''
  chatStream(
    `Please summarize the following text in a clear and concise manner, focusing on the main points and critical information. Keep the tone informative and neutral. Aim for approximately 20% of the original text's length, unless otherwise specified. Use proper formatting to organize the summary, with each key point or section on a new line. Include headings or bullet points where necessary, and use line breaks to ensure readability:
  ${data.value.content}`,
    (outputText) => {
      if (outputText === '__end__') {
        output.value = output.value.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replaceAll('*', '')
        return
      }
      output.value += outputText
    },
    { endSymbol: true },
  )
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summary document
    </template>

    <div class="flex gap-4 flex-col">
      <Tabs default-value="file">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            file
          </TabsTrigger>
          <TabsTrigger value="youtube">
            youtube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <DocumentFile
            @parsed="(title, content) => {
              data = { title, content }
            }"
          />
        </TabsContent>

        <TabsContent value="youtube">
          <DocumentYoutube
            @parsed="(title, content) => {
              data = { title, content }
            }"
          />
        </TabsContent>
      </Tabs>

      {{ data }}

      <template v-if="output">
        <div class="flex justify-center item-center gap-2 mt-4">
          <Button
            size="sm"
            :disabled="processState === 'processing' || isGenerating"
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
            :disabled="processState === 'processing' || savingState === 'saved' || savingState === 'saving'"
            @click="saveDocument"
          >
            <template v-if="savingState === 'saving'">
              <div class="flex gap-1 items-center">
                <Loader class="animate-spin size-4" />
                saving
              </div>
            </template>
            <template v-else-if="savingState === 'unsave'">
              save document
            </template>
            <template v-else>
              document saved
            </template>
          </Button>
        </div>

        <div class="p-4 border rounded-lg">
          <p ref="outputEl" class="pb-8 text-pretty text-justify" v-html="output" />
        </div>
      </template>
    </div>
  </BasePageWrap>
</template>
