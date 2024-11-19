<script setup lang="ts">
import { CornerDownLeft, Paperclip } from 'lucide-vue-next'

const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)
</script>

<template>
  <div class="h-full flex flex-col">
    <header class="z-10 flex h-[57px] shrink-0 items-center gap-1 border-b bg-background px-4">
      <div class="text-xl grow" data-allow-mismatch>
        chat
      </div>
    </header>

    <div class="grow p-2 flex flex-col">
      <div class="relative flex grow flex-col gap-4 p-2">
        <div class="grow">
          <ScrollArea class="h-full border rounded-lg p-4">
            <ul class="flex flex-col gap-2">
              <Message role="system">
                Something
              </Message>
              <Message role="user">
                Something
              </Message>
              <Message role="assistent">
                Something
              </Message>
            </ul>
          </ScrollArea>
        </div>

        <form class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
          <Textarea
            id="message"
            placeholder="type your message here..."
            class="min-h-20 resize-none border-0 p-4 shadow-none focus-visible:ring-0"
          />
          <div class="flex items-center p-4 pt-0">
            <Button variant="ghost" size="icon">
              <Paperclip class="size-4" />
            </Button>

            <Button type="submit" size="sm" class="ml-auto gap-1.5">
              send
              <CornerDownLeft class="size-4" />
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
