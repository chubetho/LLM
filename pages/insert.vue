<script setup lang="ts">
import { ArrowLeft, Pen, Plus, Trash2 } from 'lucide-vue-next'
import type { NewSet } from '~/db'

const id = ref(1)
const set = ref<NewSet>({
  name: 'new set',
  cards: [],
  tags: [],
  createAt: useDateFormat(new Date(), 'YYYY-MM-DD').value,
})
appendCard()
appendCard()

function appendCard() {
  set.value.cards.push({
    id: id.value++,
    term: '',
    def: '',
  })
}

function deleteCard(id: number) {
  set.value.cards = set.value.cards.filter(card => card.id !== id)
}

async function createSet() {
  const _set = toRaw(set.value)
  _set.cards = _set.cards.filter(card => card.term && card.def)
  if (!_set.cards.length)
    return

  const response = await chat(
    `Given this data set: ${JSON.stringify(_set)}, create a JSON response with a "name" (string) and "tags" (array of strings). Ensure:
   - "name" is descriptive, meaningful, specific, dont include "set" and never "new set"
   - "tags" must not be empty.
   - All values must be in lowercase.
   `,
    { format: 'json' },
  )

  const { name, tags } = JSON.parse(response) as { name: string, tags: string[] }

  _set.name = name.toLowerCase()
  _set.tags = tags.map(t => t.split('').filter(_t => t !== '#').join(''))

  await $fetch('/api/sets/insert', {
    method: 'POST',
    body: { set: _set },
  })
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink to="/" class="inline-flex items-center gap-2 transition-transform hover:-translate-x-1">
          <ArrowLeft class="size-4" />
          <span>create new quiz</span>
        </NuxtLink>
      </div>
    </template>

    <div>
      <div>
        <div class="flex items-center justify-between mb-5">
          <h2 class="text-lg grow flex items-center gap-3">
            <Pen class="size-4" />
            <input v-model="set.name" type="text" class="outline-none grow w-full bg-background">
          </h2>

          <Button @click="createSet">
            create
          </Button>
        </div>
        <ScrollArea class="h-[80lvh] border rounded-lg py-4 px-2">
          <ul class="grid gap-2 w-[calc(100%-2.25rem)]">
            <li
              v-for="(card, i) in set.cards"
              :key="card.id"
              class="flex items-center gap-4"
            >
              <p class="text-muted-foreground tracking-widest">
                #{{ i + 1 }}
              </p>
              <div class="relative grow grid grid-cols-2 gap-4 bg-secondary p-4 rounded-lg">
                <button
                  class="absolute bottom-4 left-4 inline-flex ml-auto"
                  @click="deleteCard(card.id)"
                >
                  <Trash2 class="size-4 text-destructive" />
                </button>
                <div>
                  <Label :for="`input_${card.id}`">term</Label>
                  <Input :id="`input_${card.id}`" v-model="card.term" placeholder="enter a value" />
                </div>
                <div>
                  <Label :for="`textarea_${card.id}`">definition</Label>
                  <Textarea :id="`textarea_${card.id}`" v-model="card.def" placeholder="enter a value" />
                </div>
              </div>
            </li>
            <li
              class="flex items-center gap-4"
            >
              <p class="text-muted-foreground tracking-widest">
                #{{ set.cards.length + 1 }}
              </p>
              <button
                class="grow bg-secondary p-4 rounded-lg flex justify-center items-center gap-1 text-sm"
                @click="appendCard"
              >
                <Plus class="size-4" />
                add flashcard
              </button>
            </li>
          </ul>
        </ScrollArea>
      </div>
    </div>
  </BasePageWrap>
</template>
