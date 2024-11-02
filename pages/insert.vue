<script setup lang="ts">
import { ArrowLeft, Loader, Pen, Plus, Sparkle, Trash2 } from 'lucide-vue-next'
import type { NewSet } from '~/db'

type Card = NewSet['cards'][0]

const id = ref(1)
const set = ref<NewSet>({
  name: '',
  cards: [],
  tags: [],
  createAt: useDateFormat(new Date(), 'YYYY-MM-DD').value,
})
appendCardManually()
appendCardManually()

function appendCardManually() {
  set.value.cards.push({
    id: id.value++,
    term: '',
    def: '',
  })
}

const canAddAutomatically = computed(() => {
  return set.value.cards.some(c => c.term?.length > 5 && c.def?.length > 5)
})
async function appendCardsAutomatically() {
  if (!canAddAutomatically.value)
    return

  const response = await chat(
    `Using these input cards as a reference: ${JSON.stringify(set.value.cards)}, generate additional, meaningful cards in JSON format as an array of objects with {term: string, def: string}. The new cards should follow the same structure and type of content but are not limited to topics mentioned in the input cards. Exclude the "id" property and ensure each new card is unique.`,
    { format: 'json' },
  )

  const _cards = JSON.parse(response).cards as { term: string, def: string }[]

  for (const c of _cards) {
    if (!c.term || !c.def)
      continue
    set.value.cards.push({
      id: id.value++,
      term: c.term,
      def: c.def,
    })
  }

  set.value.cards = set.value.cards.filter(c => c.def && c.term)
}

function deleteCard(id: number) {
  set.value.cards = set.value.cards.filter(card => card.id !== id)
}

async function generateDef(c: Card) {
  if (!c.term)
    return
  c.def = ''
  await chatStream(`Provide a brief, main-content definition for the term "${c.term}". Keep it concise.`, (output) => {
    c.def += output
  })
}

const isCreating = ref(false)
async function createSet() {
  isCreating.value = true
  const _set = toRaw(set.value)
  _set.cards = _set.cards.filter(card => card.term && card.def)
  if (!_set.cards.length)
    return

  const response = await chat(
    `Using this data set: ${JSON.stringify(_set)}, generate a JSON object with:
   - "name" (a descriptive, meaningful string without "set").
   - "tags" (an array of single-word, lowercase strings; minimum 1 tag, maximum 4).
  `,
    { format: 'json' },
  )

  const { name, tags } = JSON.parse(response) as { name: string, tags: string[] }

  _set.name = name.toLowerCase()
  _set.tags = tags.map(t => t.split('').filter(_t => t !== '#').join(''))

  const lastInsertRowid = await $fetch('/api/sets/insert', {
    method: 'POST',
    body: { set: _set },
  })
  isCreating.value = true
  navigateTo(`/sets/${lastInsertRowid}`)
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      <NuxtLink to="/" class="inline-flex items-center gap-2 transition-transform hover:-translate-x-1">
        <ArrowLeft class="size-4" />
        <span>create new quiz</span>
      </NuxtLink>
    </template>

    <div>
      <div>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg grow flex items-center gap-3">
            <Pen class="size-4" />
            <input v-model="set.name" type="text" class="outline-none grow w-full bg-background" placeholder="new set">
          </h2>

          <Button
            :disabled="isCreating"
            @click="createSet"
          >
            <div v-if="isCreating" class="flex gap-1 items-center">
              creating
              <Loader class="size-4 animate-spin" />
            </div>
            <template v-else>
              create
            </template>
          </Button>
        </div>
        <ScrollArea class="h-[80lvh] border rounded-lg pt-6 pb-24 pl-2 pr-1">
          <ul class="grid gap-2 w-[calc(100%-1rem)]">
            <li
              v-for="(card, i) in set.cards"
              :key="card.id"
              class="flex items-start gap-4"
            >
              <p class="text-muted-foreground tracking-widest w-[5ch]">
                #{{ i + 1 }}
              </p>
              <div class="relative grow grid grid-cols-2 gap-2">
                <button
                  class="absolute bottom-4 left-4 inline-flex ml-auto"
                  @click="deleteCard(card.id)"
                >
                  <Trash2 class="size-4 text-destructive" />
                </button>
                <div class="grow p-4 bg-secondary rounded-lg">
                  <Label :for="`input_${card.id}`" class="block mb-2">term</Label>
                  <Input :id="`input_${card.id}`" v-model="card.term" placeholder="enter a value" />
                </div>
                <div class="relative grow p-4 bg-secondary rounded-lg">
                  <button
                    class="absolute top-3 right-4 group disabled:text-primary/50"
                    :disabled="!card.term"
                    @click="generateDef(card)"
                  >
                    <Sparkle class="size-4 animate-pulse group-disabled:animate-none" />
                  </button>

                  <Label :for="`textarea_${card.id}`" class="block mb-2">definition</Label>
                  <Textarea :id="`textarea_${card.id}`" v-model="card.def" placeholder="enter a value" />
                </div>
              </div>
            </li>

            <li class="flex items-center gap-4 pb-8">
              <p class="text-muted-foreground tracking-widest w-[5ch]">
                #{{ set.cards.length + 1 }}
              </p>
              <div class="grow grid grid-cols-2 gap-2">
                <button
                  v-if="canAddAutomatically"
                  class="grow p-4 bg-secondary rounded-lg flex justify-center items-center gap-1 text-sm"
                  @click="appendCardsAutomatically"
                >
                  <Sparkle class="size-4 animate-pulse" />
                  add automatically
                </button>
                <button
                  class="grow p-4 bg-secondary rounded-lg flex justify-center items-center gap-1 text-sm"
                  :class="{ 'col-span-2': !canAddAutomatically }"
                  @click="appendCardManually"
                >
                  <Plus class="size-4" />
                  add manually
                </button>
              </div>
            </li>
          </ul>
        </ScrollArea>
      </div>
    </div>
  </BasePageWrap>
</template>
