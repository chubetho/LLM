<script setup lang="ts">
import { LoaderCircle, Youtube } from 'lucide-vue-next'

const emit = defineEmits<{
  parsed: [title: string, content: string]
}>()

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
const getStatus = useStatus()
const infoEl = ref<HTMLElement>()
const contentMaxHeight = ref(0)

async function parse() {
  const isValid = URL.canParse(url.value)
  if (!isValid)
    return

  getStatus.setStatus('running')
  data.value = await $fetch('/api/youtube', {
    method: 'POST',
    body: { url: url.value },
  })
  if (!data.value)
    return

  emit('parsed', data.value.title, data.value.content)
  getStatus.setStatus('done')

  await nextTick(() => {
    if (!infoEl.value)
      return

    const titleHeight = infoEl.value.querySelector('p')?.clientHeight ?? 0
    contentMaxHeight.value = infoEl.value.clientHeight - titleHeight - 16
  })
}
</script>

<template>
  <div>
    <div class="space-y-8">
      <div class="flex items-end gap-2">
        <div class="grow">
          <Label for="yt_url" class="mb-1">youtube url</Label>

          <Input
            id="yt_url"
            v-model="url"
            class="h-9"
            placeholder="https://www.youtube.com/watch?v=<id>"
          />
        </div>

        <Button
          size="sm"
          :disabled="getStatus.status.value === 'done' || getStatus.status.value === 'running'"
          @click="parse"
        >
          <template v-if="getStatus.status.value === 'running'">
            <div class="flex gap-1 items-center">
              <LoaderCircle class="animate-spin size-4" />
              getting
            </div>
          </template>
          <template v-else-if="getStatus.status.value === 'idle'">
            get info
          </template>
          <template v-else>
            info received
          </template>
        </Button>
      </div>

      <div v-if="data" class="grid grid-cols-5 gap-4 bg-secondary p-4 rounded-lg">
        <div class="rounded-lg overflow-hidden col-span-2">
          <AspectRatio :ratio="16 / 9">
            <img v-if="imgUrl" :src="imgUrl" alt="thumbnail">
            <div v-else class="w-full h-full bg-secondary flex items-center justify-center">
              <Youtube class="size-16 stroke-1 opacity-80" />
            </div>
          </AspectRatio>
        </div>
        <div ref="infoEl" class="col-span-3">
          <p class="text-lg">
            {{ data.title }}
          </p>
          <div
            class="overflow-y-auto mt-4"
            :style="{ maxHeight: `${contentMaxHeight}px` }"
          >
            <p class="text-pretty text-justify pr-4">
              {{ data.content }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
