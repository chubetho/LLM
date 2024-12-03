<script setup lang="ts">
import type { CarouselApi } from '~/components/ui/carousel'
import type { Set } from '~/utils/types'
import { ArrowLeft, Trash } from 'lucide-vue-next'

const route = useRoute('sets-id')
const id = route.params.id
const { data: set } = await useFetch<Set>(`/api/sets/get`, {
  method: 'POST',
  body: { id },
})

const api = ref<CarouselApi>()
const totalCount = ref(0)
const current = ref(0)

function setApi(val: CarouselApi) {
  api.value = val
}

watch(api, (api) => {
  if (!api)
    return

  totalCount.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap() + 1

  api.on('select', () => {
    current.value = api.selectedScrollSnap() + 1
  })
}, { once: true })

const isDeleting = ref(false)
async function deleteSet() {
  isDeleting.value = true
  await $fetch(`/api/sets/delete/${id}`)
  await navigateTo('/')
  isDeleting.value = false
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      <div class="flex items-center justify-between">
        <NuxtLink to="/" class="inline-flex items-center gap-2">
          <ArrowLeft class="size-4" />
          <span class="lowercase">{{ set?.title ?? 'not found' }}</span>
        </NuxtLink>
        <Button
          variant="destructive" size="icon" class="w-8 h-8"
          :disabled="isDeleting"
          @click="deleteSet"
        >
          <Trash class="size-4" />
        </Button>
      </div>
    </template>

    <div v-if="set">
      <div class="flex items-center justify-between mb-6 -mr-4">
        <div class="flex items-center gap-1">
          <span>tags: </span>
          <ul class="flex flex-wrap gap-1">
            <li
              v-for="tag in set.tags"
              :key="tag"
              class="lowercase"
            >
              <Badge variant="secondary">
                {{ tag }}
              </Badge>
            </li>
          </ul>
        </div>

        <NuxtLink :to="`/tests/${id}`" class="block">
          <Button>
            test
          </Button>
        </NuxtLink>
      </div>

      <div class="max-w-[80%] mx-auto space-y-4 mt-8">
        <Carousel
          class="bg-secondary rounded-lg"
          :opts="{ watchDrag: false }"
          @init-api="setApi"
        >
          <CarouselContent>
            <CarouselItem
              v-for="card in set.cards"
              :key="card.id" class="basis-full h-80 group"
            >
              <div class="relative h-full text-xl group-hover:[transform:rotateY(180deg)] transition-transform [transition-delay:300ms] duration-500 [transform-style:preserve-3d]">
                <div class="absolute inset-0 max-w-[80%] mx-auto w-full h-full flex items-center justify-center text-pretty text-center [backface-visibility:hidden]">
                  {{ card.term }}
                </div>
                <div class="absolute inset-0 max-w-[80%] mx-auto w-full h-full flex items-center justify-center text-pretty text-centers [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {{ card.def }}
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div class="text-center text-sm">
          {{ current }}/{{ totalCount }}
        </div>
      </div>

      <ul class="flex flex-col gap-4 mt-8 max-w-[90%] mx-auto">
        <li
          v-for="(c, i) in set.cards" :key="i"
          class="relative flex items-center gap-4"
        >
          <span class="absolute top-1/2 -left-14 -translate-y-1/2 text-muted-foreground min-w-[4ch] text-right">#{{ i + 1 }}</span>
          <div class="grow grid grid-cols-2 gap-4">
            <div class="p-4 rounded-lg border">
              {{ c.term }}
            </div>
            <div class="p-4 rounded-lg border">
              {{ c.def }}
            </div>
          </div>
        </li>
      </ul>
    </div>
  </BasePageWrap>
</template>
