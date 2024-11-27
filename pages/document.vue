<script setup lang="ts">
import { Loader } from 'lucide-vue-next'
import { z } from 'zod'
import BaseMarkdown from '~/components/BaseMarkdown.vue'

const data = shallowRef<{ title: string, content: string }>()

const currentTab = ref<'file' | 'youtube'>('file')
const output = ref({
  file: '',
  youtube: '',
})
const summary = computed(() => output.value[currentTab.value])

const setSchema = z.object({
  title: z.string(),
  cards: z.object({ term: z.string(), def: z.string() }).array(),
})

const processStatus = useStatus()

const isGenerating = ref(false)
async function generateSet() {
  if (!output.value)
    return

  isGenerating.value = true

  const response = await $gen(
    `
  Generate meaningful cards in JSON format based on the provided summary:

  Summary: ${summary.value}

  Output schema:
  {
    "title": string, // A concise title summarizing the card set
    "cards": Array<{
      "term": string, // The term or key concept for the card
      "def": string   // A clear and accurate definition or explanation
    }>
  }
  `,
    { format: 'json' },
  )

  isGenerating.value = false

  const set = setSchema.safeParse(JSON.parse(response))
  console.log(set)

  if (set.error || !set.data) {
    console.error(set.error)
    return
  }

  useState('set_from_document', () => ({ title: set.data.title, cards: set.data.cards }))
  navigateTo('/sets/create')
}

function process(title: string, content: string) {
  $abort()

  data.value = { title, content }

  const messages = $chunk(content, { max: 2048 }).map(c => ({
    role: 'system',
    content: c,
  }))

  messages.unshift({
    role: 'system',
    content: 'Provide a text in small chunks',
  })

  messages.push({
    role: 'user',
    content: 'Provide a detailed summary of the text, including the main arguments, supporting evidence, and any key takeaways.',
  })

  output.value[currentTab.value] = ''

  $chat(messages, (outputText) => {
    if (outputText === '__end__') {
      return
    }
    output.value[currentTab.value] += outputText
  }, { endSymbol: true })
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summary
    </template>

    <div class="flex gap-4 flex-col pb-4">
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
        <div class="flex justify-center item-center gap-2 mt-0">
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
        </div>

        <div class="p-4 border rounded-lg">
          <BaseMarkdown :input="output[currentTab]" />
        </div>
      </template>
    </div>
  </BasePageWrap>
</template>
