<script setup lang="ts">
import { ArrowLeft, Loader, Pen, Plus, Sparkle, Trash } from 'lucide-vue-next'

type Card = NonNullable<NewSet['cards']>[0]
type NewCard = Omit<Card, 'id'>
const setFromDocument = useState<{ title: string, cards: (Omit<Card, 'id'>)[] }>('set_from_document')

const id = ref(1)
const set = ref<NewSet>({
  title: '',
  cards: [],
  tags: [],
  createAt: useDateFormat(new Date(), 'YYYY-MM-DD').value,
})

if (setFromDocument.value) {
  console.log(setFromDocument.value)
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

function appendCardManually() {
  set.value.cards.push({
    id: id.value++,
    term: '',
    def: '',
  })
}

const canAutoAdd = computed(() => set.value.cards.some(c => c.term?.length && c.def?.length))

const isAppending = ref(false)
async function appendCardsAuto() {
  if (!canAutoAdd.value)
    return

  isAppending.value = true
  const response = await $gen(
    `Based on the following reference cards: ${JSON.stringify(set.value.cards)}, generate additional, meaningful cards in JSON format. Each card should adhere to the schema below, follow the structure and type of content of the reference cards, and include unique information. Avoid duplicating topics or reusing exact terms from the reference cards.

    JSON Schema for the output:
    {
      "cards": [
        {
          "term": "string",        // The term or concept being defined.
          "def": "string"          // The detailed definition or explanation of the term.
        }
      ]
    }

    Output should be an array of objects conforming to the schema above. Do not include any additional properties such as "id".`,
    { format: 'json' },
  )

  const _cards = JSON.parse(response).cards as NewCard[]
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
  isAppending.value = false
}

function deleteCard(id: number) {
  set.value.cards = set.value.cards.filter(card => card.id !== id)
}

async function generateDef(c: Card) {
  if (!c.term)
    return
  c.def = ''
  await $genStream(`Provide a short, main-content definition for the term "${c.term}". Keep it concise.`, (output) => {
    c.def += output
  })
}

const isCreating = ref(false)
async function create() {
  isCreating.value = true
  const _set = toRaw(set.value)
  _set.cards = _set.cards.filter(card => card.term && card.def)
  if (!_set.cards.length)
    return

  const response = await $gen(
    `Using the dataset: ${JSON.stringify(_set.cards)}, create a JSON object with the following schema:
  {
    "title": "string", // A descriptive and meaningful string that summarizes the dataset.
    "tags": ["string"] // An array of 1 to 4 single-word strings that characterize the dataset.
  }
  Only include these properties and exclude all others.`,
    { format: 'json' },
  )
  const { title, tags } = JSON.parse(response) as { title: string, tags: string[] }

  _set.title = set.value.title || title.toLowerCase()
  _set.tags = tags
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
        <span>create new quiz</span>
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
          size="sm"
          @click="create"
        >
          <div v-if="isCreating" class="flex gap-1 items-center">
            <Loader class="size-4 animate-spin" />
            creating
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
                @click="generateDef(card)"
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
              @click="appendCardsAuto"
            >
              <template v-if="isAppending">
                <Loader class="size-4 animate-spin" />
                generating
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
