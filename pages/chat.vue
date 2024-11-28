<script setup lang="ts">
import { CircleStop, CornerDownLeft, Eraser, Paperclip, Settings2 } from 'lucide-vue-next'

const container = ref<HTMLDivElement>()
const anchor = ref<HTMLSpanElement>()
const height = ref(0)

const toolsConfig = useLocalStorage('llm_tools', () => DEFAULT_TOOLS_CONFIG)

const content = ref('')
const response = ref('')
const status = useStatus()
const DEFAULT_MESSAGES: Message[] = [
  { role: 'system', content: 'you are an assistant for my studies.', type: 'text' },
]

const instruction = useLocalStorage('llm_instruction', () => DEFAULT_MESSAGES[0].content)
const isInstructionDialogOpen = ref(false)
const messages = useLocalStorage<Message[]>('llm_messages', () => DEFAULT_MESSAGES)

function scroll() {
  anchor.value?.scrollIntoView({ behavior: 'smooth' })
}

async function send() {
  if (status.status.value === 'running')
    return

  status.setStatus('running')

  messages.value.push({
    role: 'user',
    content: content.value,
  })
  content.value = ''

  await $chat(messages.value, (o) => {
    if (status.status.value === 'idle') {
      return
    }

    if (o === '__end__') {
      messages.value.push({
        role: 'assistant',
        content: response.value,
      })
      response.value = ''
      status.setStatus('idle')
      scroll()

      return
    }

    response.value += o
  }, { endSymbol: true })
}

async function stop() {
  $abort()
  messages.value.push({
    role: 'assistant',
    content: response.value,
  })
  response.value = ''
  status.setStatus('idle')
}

function clear() {
  messages.value = DEFAULT_MESSAGES
}

function saveInstruction() {
  messages.value.shift()
  messages.value.unshift({ role: 'system', content: instruction.value, type: 'text' })
  isInstructionDialogOpen.value = false
}

useEventListener('resize', () => {
  height.value = container.value?.clientHeight ?? 0
  setTimeout(() => scroll(), 1000)
})

onMounted(() => {
  window.dispatchEvent(new Event('resize'))
})

const { open: openUpload, files, reset } = useFileDialog({
  accept: 'application/pdf',
  multiple: false,
})

watch(files, async (v) => {
  if (!v || !v.length)
    return

  const file = v[0]
  const formData = new FormData()
  formData.append('data', file)
  reset()

  const content = await $fetch('/api/pdf', {
    method: 'POST',
    body: formData,
  })
  if (!content)
    return

  messages.value.push({
    role: 'system',
    content: `You are a helpful assistant knowledgeable about the following document: ${content.toString()}`,
    type: 'file',
    name: file.name,
  })
})
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="z-10 flex justify-between h-[57px] shrink-0 items-center gap-1 border-b bg-background px-4">
      <div class="text-xl grow">
        chat
      </div>

      <div class="flex items-center gap-2">
        <Button size="icon" variant="ghost" @click="clear">
          <Eraser class="size-5 text-destructive" />
        </Button>

        <Dialog v-model:open="isInstructionDialogOpen">
          <DialogTrigger as="div">
            <Button size="icon" variant="ghost">
              <Settings2 class="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>instruction</DialogTitle>
            </DialogHeader>
            <DialogDescription class="sr-only">
              instruction for model
            </DialogDescription>

            <div>
              <Textarea v-model="instruction" class="min-h-32" />
            </div>

            <DialogFooter>
              <Button @click="saveInstruction">
                save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>

    <div class="grow p-2 flex flex-col">
      <div class="relative flex grow flex-col gap-4 p-2">
        <div ref="container" class="relative grow">
          <ScrollArea
            class="border rounded-lg py-4 pl-2 pr-6"
            :style="{ height: `${height}px` }"
          >
            <ul class="flex flex-col gap-4" data-allow-mismatch>
              <Message
                v-for="(m, i) in messages"
                :key="i"
                :message="m"
              />

              <Message :message="{ role: 'assistant', content: response }" />
              <p ref="anchor" class="mt-auto pb-8" />
            </ul>
          </ScrollArea>
        </div>

        <form
          class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring"
          @submit.prevent="send"
        >
          <Textarea
            v-model="content"
            placeholder="type your message here..."
            class="min-h-20 resize-none border-0 p-4 shadow-none focus-visible:ring-0"
            :disabled="status.status.value === 'running'"
            @keyup.enter.exact="send"
          />
          <div class="flex items-center p-4 pt-0">
            <Button
              variant="ghost" size="icon" type="button"
              @click="openUpload"
            >
              <Paperclip class="size-4" />
            </Button>

            <div class="flex items-center gap-1.5 ml-auto">
              <Button
                v-if="status.status.value === 'idle'"
                type="submit"
                size="sm"
                class="gap-1"
              >
                send
                <CornerDownLeft class="size-4" />
              </Button>

              <Button
                v-else
                size="icon"
                variant="destructive"
                @click="stop"
              >
                <CircleStop class="size-5" />
              </Button>
            </div>
          </div>
        </form>
      </div>

      <hr class="my-2">

      <div class="flex items-center justify-between h-10 px-2">
        <p class="text-sm text-muted-foreground">
          model: {{ toolsConfig.name }} | profile: {{ toolsConfig.profile }}
        </p>

        <p class="text-sm text-muted-foreground">
          temperature: {{ toolsConfig.temperature }} | top k: {{ toolsConfig.topK }} | top p: {{ toolsConfig.topP }}
        </p>
      </div>
    </div>
  </div>
</template>
