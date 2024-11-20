<script setup lang="ts">
import type { Message } from 'ollama'
import { CircleStop, CornerDownLeft, Eraser, Paperclip, Settings2 } from 'lucide-vue-next'

const container = ref<HTMLDivElement>()
const anchor = ref<HTMLSpanElement>()
const height = ref(0)

const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

const messages = useLocalStorage<Message[]>('llm_messages', () => [])

const content = ref('')
const response = ref('')
const status = useStatus()

async function send() {
  status.setStatus('running')

  messages.value.push({
    role: 'user',
    content: content.value,
  })

  content.value = ''

  await $chat(messages.value, (o) => {
    if (status.status.value === 'idle') {
      response.value = ''
      return
    }

    if (o === '__end__') {
      messages.value.push({
        role: 'assistant',
        content: response.value,
      })
      response.value = ''
      status.setStatus('idle')
      return
    }

    response.value += o
  }, { endSymbol: true })
}

async function stop() {
  try {
    $abort()
  }
  catch {}

  status.setStatus('idle')
}

function clear() {
  messages.value = []
}

useEventListener('resize', () => {
  height.value = container.value?.clientHeight ?? 0
  // setTimeout(() => {
  //   anchor.value?.scrollIntoView({ behavior: 'smooth' })
  // }, 1000)
})
onMounted(() => {
  window.dispatchEvent(new Event('resize'))
})
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="z-10 flex justify-between h-[57px] shrink-0 items-center gap-1 border-b bg-background px-4">
      <div class="text-xl grow" data-allow-mismatch>
        chat
      </div>

      <div class="flex items-center gap-2">
        <Button size="icon" variant="ghost" @click="clear">
          <Eraser class="size-5 text-destructive" />
        </Button>

        <Dialog>
          <DialogTrigger as="div">
            <Button size="icon" variant="ghost">
              <Settings2 class="size-5" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>

            <DialogFooter>
              <Button>
                save
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </header>

    <div class="grow p-2 flex flex-col">
      <div class="relative flex grow flex-col gap-4 p-2">
        <div ref="container" class="grow">
          <ScrollArea
            class="border rounded-lg py-4 pl-2 pr-6"
            :style="{ height: `${height}px` }"
          >
            <ul class="flex flex-col gap-4">
              <Message
                v-for="(m, i) in messages"
                :key="i"
                :role="m.role"
                :value="m.content"
              />

              <Message role="assistant" :value="response" />
              <span ref="anchor" />
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
            @keyup.enter="send"
          />
          <div class="flex items-center p-4 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip class="size-4" />
            </Button>

            <Button
              v-if="status.status.value === 'idle'"
              type="submit"
              size="sm"
              class="ml-auto gap-1.5"
            >
              send
              <CornerDownLeft class="size-4" />
            </Button>

            <Button v-else size="icon" class="ml-auto" @click="stop">
              <CircleStop class="size-5" />
            </Button>
          </div>
        </form>
      </div>

      <hr class="my-2">

      <div class="flex items-center justify-between h-10 px-2">
        <p class="text-sm text-muted-foreground">
          model: {{ toolsConfig.name }} | profile: {{ toolsConfig.profile }}
        </p>

        <p class="text-sm text-muted-foreground">
          temperature: {{ toolsConfig.temperature }} | topK: {{ toolsConfig.topK }} | topP: {{ toolsConfig.topP }}
        </p>
      </div>
    </div>
  </div>
</template>
