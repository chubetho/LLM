<script setup lang="ts">
import { LoaderCircle } from 'lucide-vue-next'
import { z } from 'zod'
import BaseMarkdown from '~/components/BaseMarkdown.vue'

const data = shallowRef<{ title: string, content: string }>()

const currentTab = ref<'file' | 'youtube'>('file')
const output = ref({
  file: '',
  youtube: '',
})
const summary = computed(() => output.value[currentTab.value])

const processStatus = useStatus()

const isGenerating = ref(false)
async function generateSet() {
  if (!output.value)
    return

  isGenerating.value = true

  const schema = z.object({
    title: z.string().describe('A concise title summarizing the card set'),
    cards: z.object({
      term: z.string().describe('The term or key concept for the card'),
      def: z.string().describe('A short, clear and accurate definition or explanation'),
    }).array(),
  })

  const response = await $generate(
    `Generate meaningful cards in JSON format based on the provided summary:
      Summary: ${summary.value}
  `,
    { schema },
  )

  isGenerating.value = false

  useState('set_from_document', () => ({ title: response.title, cards: response.cards }))
  navigateTo('/sets/create')
}

async function process(title: string, content: string) {
  $abort()

  data.value = { title, content }

  const messages = [
    {
      role: 'system',
      content: 'Given a text in following small chunks:',
    },
  ]

  for (const c of $chunk(content, { max: 2048 })) {
    messages.push({
      role: 'system',
      content: c,
    })
  }

  messages.push({
    role: 'user',
    content: 'Provide a detailed summary of the text, including the main arguments, supporting evidence, and any key takeaways.',
  })

  output.value[currentTab.value] = ''

  await $chatStream(messages, (outputText) => {
    output.value[currentTab.value] += outputText
  })
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      summarize
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
            :disabled="processStatus.status.value === 'running' || isGenerating"
            @click="generateSet"
          >
            <template v-if="isGenerating">
              <div class="flex gap-1 items-center">
                generating
                <LoaderCircle class="animate-spin size-4" />
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
