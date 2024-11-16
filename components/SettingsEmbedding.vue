<script setup lang="ts">
import { CornerDownLeft } from 'lucide-vue-next'
import { DEFAULT_EMBEDDING_CONF } from '~/utils/constants'

const models = await $list()

const embeddingOpts = models.embeddings.map(m => ({
  label: `${m.shortname}:${m.parameter_size} ${m.quantization_level}`,
  value: m.name,
}))

const embeddingConfig = useLocalStorage('llm_embedding', DEFAULT_EMBEDDING_CONF)

const input = ref('')
const sendStatus = useStatus()

const response = ref({
  head: '',
  tail: '',
  length: 0,
})

async function send() {
  sendStatus.setStatus('running')
  $abort()

  const result = await $embed(input.value)
  const max = 10
  response.value = {
    head: result.slice(0, max).join(' '),
    tail: result.slice(result.length - max, result.length).join(' '),
    length: result.length,
  }
  sendStatus.setStatus('done')
}
</script>

<template>
  <div class="grid h-full flex-1 gap-4 overflow-auto grid-cols-3">
    <div class="relative flex h-full flex-col items-start gap-8">
      <form class="grid w-full h-full items-start gap-6">
        <fieldset class="h-full grid gap-6 rounded-lg border p-4">
          <legend class="-ml-1 px-1 text-sm font-medium">
            embedding
          </legend>

          <Select v-model="embeddingConfig.name">
            <SelectTrigger id="tools_name">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem
                v-for="o in embeddingOpts"
                :key="o.value"
                :value="o.value"
              >
                {{ o.label }}
              </SelectItem>
            </SelectContent>
          </Select>
        </fieldset>
      </form>
    </div>
    <div class="pt-2 col-span-2">
      <div class="border p-4 rounded-lg h-full flex flex-col">
        <div class="h-40 font-mono">
          <template v-if="response.length">
            <p>{{ response.head }}</p>
            <p>...</p>
            <p>{{ response.tail }}</p>
            <p class="text-muted-foreground">
              [{{ response.length }} entries]
            </p>
          </template>
        </div>

        <div class="mt-auto">
          <form class="flex gap-2" @submit.prevent="send">
            <Input v-model="input" class="grow" placeholder="give me text to embed" />
            <Button size="icon" class="shrink-0" type="submit" :disabled="sendStatus.status.value === 'running'">
              <CornerDownLeft class="size-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>
