<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import BaseMarkdown from '~/components/BaseMarkdown.vue'

const data = shallowRef<{ title: string, content: string }>()

const currentTab = ref<'file' | 'youtube'>('file')
const output = ref({
  file: '',
  youtube: '',
})

const processStatus = useStatus()

const isGenerating = ref(false)
async function generateSet() {
  if (!output.value)
    return

  isGenerating.value = true

  const response = await $chat(
    `Using this summary ${JSON.stringify(output.value)} to generate, meaningful cards in JSON format as an array of objects with {term: string, def: string}. ensure each new card is unique.`,
    { format: 'json' },
  )

  isGenerating.value = false

  useState('set_from_yt', () => ({ title: data.value?.title, cards: JSON.parse(response).cards }))
  navigateTo('/insert')
}

const saveStatus = useStatus()
async function saveDocument() {
  saveStatus.setStatus('running')

  const embedding = await $embed(output.value[currentTab.value])

  await $fetch('/api/docs', {
    method: 'POST',
    body: {
      contents: output.value,
      embedding,
    },
  })

  saveStatus.setStatus('done')
}

function process(title: string, content: string) {
  $abort()

  data.value = { title, content }

  output.value[currentTab.value] = ''
  $chatStream(
    `Provide a detailed summary of the text, including the main arguments, supporting evidence, and any key takeaways. Output in Markdown format.
  ${data.value.content}`,
    (outputText) => {
      if (outputText === '__end__') {
        output.value[currentTab.value] = output.value[currentTab.value].trim()
        return
      }
      output.value[currentTab.value] += outputText
    },
    { endSymbol: true },
  )
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summary
    </template>

    <div class="flex gap-4 flex-col pb-8">
      <Tabs v-model="currentTab" default-value="file">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            file
          </TabsTrigger>
          <TabsTrigger value="youtube">
            youtube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file" force-mount>
          <DocumentFile @parsed="process" />
        </TabsContent>

        <TabsContent value="youtube" force-mount>
          <DocumentYoutube @parsed="process" />
        </TabsContent>
      </Tabs>

      <template v-if="output[currentTab]">
        <div class="flex justify-center item-center gap-2 mt-2">
          <Button
            size="sm"
            :disabled="processStatus.status.value === 'running' || isGenerating"
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
            :disabled="processStatus.status.value === 'running' || saveStatus.status.value === 'done' || saveStatus.status.value === 'running'"
            @click="saveDocument"
          >
            <template v-if="saveStatus.status.value === 'running'">
              <div class="flex gap-1 items-center">
                <Loader class="animate-spin size-4" />
                saving
              </div>
            </template>
            <template v-else-if="saveStatus.status.value === 'idle'">
              save document
            </template>
            <template v-else>
              document saved
            </template>
          </Button>
        </div>

        <div class="p-4 border rounded-lg">
          <BaseMarkdown :input="output[currentTab]" />
        </div>
      </template>
    </div>
  </BasePageWrap>
</template>
