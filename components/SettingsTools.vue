<script setup lang="ts">
import { CornerDownLeft } from 'lucide-vue-next'
import { DEFAULT_TOOLS_CONFIG, toolsProfileOpts } from '~/utils/constants'

const models = await $list()

const toolsOpts = models.tools.map(m => ({
  label: `${m.shortname}:${m.parameter_size} ${m.quantization_level}`,
  value: m.name,
}))

const toolsConfig = useLocalStorage('llm_tools', DEFAULT_TOOLS_CONFIG)

watch([
  () => toolsConfig.value.temperature,
  () => toolsConfig.value.topK,
  () => toolsConfig.value.topP,
], ([te, tk, tp]) => {
  const p = toolsProfileOpts.find(p => p.temperature === te && p.topK === tk && p.topP === tp)
  if (!p)
    toolsConfig.value.profile = 'custom'
})

watch(() => toolsConfig.value.profile, (v) => {
  const conf = toolsProfileOpts.find(p => p.name === v)
  if (!conf)
    return

  switch (v) {
    case 'creative':
    case 'default':
    case 'concise':{
      toolsConfig.value.temperature = conf.temperature
      toolsConfig.value.topK = conf.topK
      toolsConfig.value.topP = conf.topP
      break
    }

    case 'custom': break
  }
})

const input = ref('')
const response = ref('')
const sendStatus = useStatus()

async function send() {
  sendStatus.setStatus('running')
  $abort()
  response.value = ''
  await $generateStream(input.value, (o) => {
    if (o === '__end__') {
      sendStatus.setStatus('done')
      return
    }
    response.value += o
  }, { endSymbol: true })
}
</script>

<template>
  <div class="grid h-full flex-1 gap-4 overflow-auto grid-cols-3">
    <div class="relative flex h-full flex-col items-start gap-8">
      <form class="grid w-full items-start gap-6">
        <fieldset class="grid gap-6 rounded-lg border p-4">
          <legend class="-ml-1 px-1 text-sm font-medium">
            tools
          </legend>

          <Select v-model="toolsConfig.name">
            <SelectTrigger id="tools_name">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="o in toolsOpts"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </SelectItem>
            </SelectContent>
          </Select>

          <div class="grid gap-3">
            <Label for="tools_profile">profile</Label>

            <Select v-model="toolsConfig.profile">
              <SelectTrigger id="tools_profile">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="o in toolsProfileOpts"
                  :key="o.name"
                  :value="o.name"
                >
                  {{ o.name }}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div class="grid grid-cols-3 gap-4">
            <div class="grid gap-3">
              <Label for="tools_temperature">
                <HoverCard>
                  <HoverCardTrigger>
                    <span class="border-b-2 border-dashed cursor-pointer dark:border-primary/50">temperature?</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Controls randomness. Higher values yield more creative outputs; lower values make responses more focused.
                  </HoverCardContent>
                </HoverCard>
              </Label>
              <Input id="tools_temperature" v-model="toolsConfig.temperature" type="number" min="0" step="0.1" />
            </div>
            <div class="grid gap-3">
              <Label for="tools_top-k">
                <HoverCard>
                  <HoverCardTrigger>
                    <span class="border-b-2 border-dashed cursor-pointer dark:border-primary/50">top-k?</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Restricts choices to the top-k most probable tokens, affecting diversity—higher values increase randomness, lower values make output predictable.
                  </HoverCardContent>
                </HoverCard>
              </Label>
              <Input id="tools_top-k" v-model="toolsConfig.topK" type="number" min="1" step="1" />
            </div>
            <div class="grid gap-3">
              <Label for="tools_top-p">
                <HoverCard>
                  <HoverCardTrigger>
                    <span class="border-b-2 border-dashed cursor-pointer dark:border-primary/50">top-p?</span>
                  </HoverCardTrigger>
                  <HoverCardContent>
                    Limits token selection to those whose combined probability is greater than p, balancing creativity and coherence.
                  </HoverCardContent>
                </HoverCard>
              </Label>
              <Input id="tools_top-p" v-model="toolsConfig.topP" type="number" min="0" step="0.05" max="1" />
            </div>
          </div>
        </fieldset>
      </form>
    </div>
    <div class="pt-2 col-span-2">
      <div class="border p-4 rounded-lg h-full flex flex-col">
        <ScrollArea class="h-[172px]">
          <BaseMarkdown v-if="response" :input="response" class="pr-1" />
        </ScrollArea>

        <div class="mt-auto">
          <form class="flex gap-2" @submit.prevent="send">
            <Input v-model="input" class="grow" placeholder="ask me something" />
            <Button size="icon" class="shrink-0" type="submit" :disabled="sendStatus.status.value === 'running'">
              <CornerDownLeft class="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
