<script setup lang="ts">
import { ArrowLeft } from 'lucide-vue-next'
import type { CarouselApi } from '~/components/ui/carousel'
import type { Set } from '~/db'

const route = useRoute('sets-id')
const setId = route.params.id
const { data: set } = await useFetch<Set>(`/api/sets/${setId}`)

const api = ref<CarouselApi>()
const totalCount = ref(0)
const current = ref(0)

function setApi(val: CarouselApi) {
  api.value = val
}

watchOnce(api, (api) => {
  if (!api)
    return

  totalCount.value = api.scrollSnapList().length
  current.value = api.selectedScrollSnap() + 1

  api.on('select', () => {
    current.value = api.selectedScrollSnap() + 1
  })
})

async function demo() {
  console.log(set.value?.cards)
  const response = await chat(`Using the following flashcard data, create a set of comprehensive test questions that assess understanding, recall, and application:

Cards:
ID: 1, Term: 'What is the powerhouse of the cell?', Definition: 'The mitochondria.'
ID: 2, Term: 'What is the capital of France?', Definition: 'Paris.'
ID: 3, Term: 'What is the boiling point of water?', Definition: '100°C.'
Generate multiple question formats (e.g., multiple-choice, short answer, fill-in-the-blank) to cover each topic, focusing on varied difficulty levels to thoroughly evaluate mastery of these topics.`, { format: 'json' })
  console.log(response)
}
</script>

<template>
  <BasePageWrap v-if="set">
    <template #heading>
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink to="/" class="inline-flex items-center gap-2 transition-transform hover:-translate-x-1">
          <ArrowLeft class="size-4" />
          <span>{{ set.name }}</span>
        </NuxtLink>
      </div>
    </template>

    <div>
      <div class="flex items-center gap-1 mb-12">
        <span>tags: </span>
        <ul class="flex flex-wrap gap-1">
          <li
            v-for="tag in set.tags"
            :key="tag"
          >
            <Badge variant="secondary">
              {{ tag }}
            </Badge>
          </li>
        </ul>
      </div>

      <div class="max-w-[80%] mx-auto">
        <Carousel
          class="bg-secondary rounded-lg mb-4"
          :opts="{ watchDrag: false }"
          @init-api="setApi"
        >
          <CarouselContent>
            <CarouselItem
              v-for="card in set.cards"
              :key="card.id" class="basis-full h-80 group"
            >
              <div class="relative h-full group-hover:[transform:rotateY(180deg)] transition-transform [transition-delay:300ms] duration-500 [transform-style:preserve-3d]">
                <div class="absolute inset-0 w-full h-full flex items-center justify-center [backface-visibility:hidden]">
                  {{ card.term }}
                </div>
                <div class="absolute inset-0 w-full h-full flex items-center justify-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
                  {{ card.def }}
                </div>
              </div>
            </CarouselItem>
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>

        <div class="text-center">
          {{ current }}/{{ totalCount }}
        </div>
      </div>

      <Separator label="test" class="my-10" />
      <Button @click="demo">
        demo
      </Button>
    </div>
  </BasePageWrap>
</template>
