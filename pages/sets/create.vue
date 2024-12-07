<script setup lang="ts">
import { ArrowLeft, LoaderCircle, Pen, Plus, Sparkle, Trash } from 'lucide-vue-next'
import { z } from 'zod'

type Card = NonNullable<NewSet['cards']>[0]
const setFromDocument = useState<{ title: string, cards: (Omit<Card, 'id'>)[] }>('set_from_document')

const id = ref(1)
const set = ref<NewSet>({
  title: '',
  cards: [],
  tags: [],
  createAt: useDateFormat(new Date(), 'YYYY-MM-DD').value,
})

if (setFromDocument.value) {
  set.value.title = setFromDocument.value.title
  for (const c of setFromDocument.value.cards) {
    set.value.cards.push({
      id: id.value++,
      term: c.term,
      def: c.def,
    })
  }
}
else {
  appendCardManually()
  appendCardManually()
}

async function genDef(c: Card) {
  if (!c.term)
    return
  c.def = ''
  await $genStream(
    `"${c.term}": Provide a short, plain text definition without any redundant information.`,
    o => c.def += o,
  )
}

function appendCardManually() {
  set.value.cards.push({
    id: id.value++,
    term: '',
    def: '',
  })
}

const canAutoAdd = computed(() => set.value.cards.some(c => c.term?.length && c.def?.length))

const isAppending = ref(false)
async function autoAppendCards() {
  if (!canAutoAdd.value)
    return

  isAppending.value = true
  const schema = z.array(z.object({ term: z.string(), def: z.string() }))
  const _cards = set.value.cards.map(({ term, def }) => ({ term, def }))
  const cards = await $generate(
    `Generate new cards in JSON format based on the reference cards: ${JSON.stringify(_cards)}. Return only the JSON array but not in code block.`,
    { schema },
  )

  for (const c of cards) {
    set.value.cards.push({
      id: id.value++,
      term: c.term,
      def: c.def,
    })
  }
  set.value.cards = set.value.cards.filter(c => c.def && c.term)
  isAppending.value = false
}

function deleteCard(id: number) {
  set.value.cards = set.value.cards.filter(card => card.id !== id)
}

const isCreating = ref(false)
async function create() {
  isCreating.value = true
  const _set = toRaw(set.value)
  _set.cards = _set.cards.filter(card => card.term && card.def)
  if (!_set.cards.length)
    return

  const schema = z.object({
    title: z.string().trim().toLowerCase().min(3).describe('A clear and concise title summarizing the dataset in lowercase. Minimum 3 characters.'),
    tags: z.array(z.string().trim().toLowerCase()).min(4).describe('An array of at least 4 lowercase, single-word strings that describe the dataset.'),
  })

  const response = await $generate(
    `Based on the dataset provided below, generate a descriptive "title" and at least 4 meaningful "tags" that best characterize the dataset.
  
  Dataset: ${JSON.stringify(_set.cards)}`,
    { schema },
  )

  _set.title = set.value.title || response.title
  _set.tags = response.tags
  _set.embedding = await $embed(JSON.stringify({
    title: _set.title,
    cards: _set.cards,
    tags: _set.tags,
  }))

  const lastInsertRowid = await $fetch('/api/sets/create', {
    method: 'POST',
    body: { set: _set },
  })
  isCreating.value = false

  navigateTo(`/sets/${lastInsertRowid}`)
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      <NuxtLink to="/" class="inline-flex items-center gap-2">
        <ArrowLeft class="size-4" />
        <span>create new set</span>
      </NuxtLink>
    </template>

    <div class="space-y-8">
      <div class="flex items-center justify-between">
        <h2 class="text-lg grow flex items-center gap-3">
          <Pen class="size-4" />
          <input v-model="set.title" type="text" class="outline-none grow w-full bg-background" placeholder="new set">
        </h2>

        <Button
          :disabled="isCreating"
          @click="create"
        >
          <div v-if="isCreating" class="flex gap-1 items-center">
            creating
            <LoaderCircle class="size-4 animate-spin" />
          </div>
          <template v-else>
            create
          </template>
        </Button>
      </div>

      <ul class="grid gap-2">
        <li
          v-for="(card, i) in set.cards"
          :key="card.id"
          class="flex items-baseline gap-4"
        >
          <p class="text-muted-foreground tracking-widest w-[5ch]">
            #{{ i + 1 }}
          </p>
          <div class="grow grid grid-cols-2 gap-2">
            <div class="relative grow p-4 bg-secondary rounded-lg">
              <Label :for="`textarea_term_${card.id}`" class="block mb-2">term</Label>
              <Textarea :id="`textarea_term_${card.id}`" v-model="card.term" placeholder="enter a value" />
              <button
                class="absolute top-3 right-4"
                @click="deleteCard(card.id)"
              >
                <Trash class="size-4 text-destructive stroke-[3px]" />
              </button>
            </div>

            <div class="relative grow p-4 bg-secondary rounded-lg">
              <Label :for="`textarea_def_${card.id}`" class="block mb-2">definition</Label>
              <Textarea :id="`textarea_def_${card.id}`" v-model="card.def" placeholder="enter a value" />
              <button
                class="absolute top-3 right-4 group disabled:text-primary/50"
                :disabled="!card.term"
                @click="genDef(card)"
              >
                <Sparkle class="size-4 animate-pulse group-disabled:animate-none" />
              </button>
            </div>
          </div>
        </li>

        <li class="flex items-center gap-4 pb-8">
          <p class="text-muted-foreground tracking-widest w-[5ch]">
            #{{ set.cards.length + 1 }}
          </p>
          <div class="grow grid grid-cols-2 gap-2">
            <button
              v-if="canAutoAdd"
              class="grow py-3 bg-secondary rounded-lg flex justify-center items-center gap-1 text-sm disabled:opacity-50"
              :disabled="!canAutoAdd || isAppending"
              @click="autoAppendCards"
            >
              <template v-if="isAppending">
                generating
                <LoaderCircle class="size-4 animate-spin" />
              </template>
              <template v-else>
                <Sparkle class="size-4 animate-pulse" />
                add automatically
              </template>
            </button>
            <button
              class="grow py-3 bg-secondary rounded-lg flex justify-center items-center gap-1 text-sm"
              :class="{ 'col-span-2': !canAutoAdd }"
              @click="appendCardManually"
            >
              <Plus class="size-4" />
              add manually
            </button>
          </div>
        </li>
      </ul>
    </div>
  </BasePageWrap>
</template>
