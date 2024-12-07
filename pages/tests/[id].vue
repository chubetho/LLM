<script setup lang="ts">
import type { Question, Set } from '~/utils/types'
import { ArrowLeft, LoaderCircle } from 'lucide-vue-next'
import { z } from 'zod'

definePageMeta({
  key: route => route.fullPath,
})

const route = useRoute('tests-id')
const id = route.params.id
const { data: set } = await useFetch<Set>(`/api/sets/get`, {
  method: 'POST',
  body: { id },
})

const questions = ref<(Question)[]>([])
const state = ref<'testing' | 'submitted'>('testing')
const currentId = ref(0)
const currentQuestion = computed(() => questions.value.find(q => q.id === currentId.value))
const progress = computed(() => Math.floor((currentId.value + 1) * 100 / questions.value.length))
const score = ref(0)

async function generate() {
  if (!set.value)
    return

  const systemPrompt = `
You are a knowledgeable teacher tasked with creating educational questions in JSON format. Your goal is to generate exactly ${set.value.cards.length * 2} questions based on the user's flashcard data. Ensure all question types appear at least once, and all questions are structured properly and follow the schema.

### Example Output:
{
  "questions": [
    {
      "type": "fill_blank",
      "question": "The capital of France is ___",
      "answer": "Paris"
    },
    {
      "type": "multiple_choice",
      "question": "What is the capital of France?",
      "answer": "Paris",
      "options": ["Paris", "London", "Rome", "Berlin"]
    },
    {
      "type": "true_false",
      "question": "The Earth revolves around the Sun.",
      "answer": "true"
    }
  ]
}
`

  const schema = z.object({
    questions: z
      .array(questionSchema)
      .min(set.value.cards.length * 2)
      .refine((questions) => {
        const types = questions.map(q => q.type)
        return (
          types.includes('fill_blank')
          && types.includes('multiple_choice')
          && types.includes('true_false')
        )
      }, {
        message: 'The questions array must include at least one question of each type: fill_blank, multiple_choice, and true_false.',
      }),
  })

  const response = await $chat(
    [
      {
        role: 'system',
        content: systemPrompt,
      },
      {
        role: 'user',
        content: JSON.stringify(set.value.cards),
      },
    ],
    { schema },
  )

  questions.value = response.questions.map((q, id) => ({ ...q, id, input: undefined })) as any
}

onMounted(() => {
  generate()
})

provide('context', { questions, state })

function submit() {
  state.value = 'submitted'
  questions.value.forEach(q => q.input?.trim())
  score.value = questions.value.reduce((acc, cur) => cur.input?.toLowerCase() === cur.answer.toLowerCase() ? acc + 1 : acc, 0)
}

function reset() {
  state.value = 'testing'
  currentId.value = 0
  score.value = 0
  questions.value.forEach(q => q.input = undefined)
}
</script>

<template>
  <div>
    <header class="z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div class="text-xl grow" data-allow-mismatch>
        <div class="flex items-center justify-between">
          <NuxtLink :to="`/sets/${id}`" class="inline-flex items-center gap-2">
            <ArrowLeft class="size-4" />
            <span class="lowercase">test | {{ set?.title ?? 'not found' }}</span>
          </NuxtLink>

          <div class="flex justify-end">
            <Button
              v-if="state === 'testing'"
              :disabled="!questions.length"
              @click="submit"
            >
              submit
            </Button>
            <Button
              v-if="state === 'submitted'"
              :disabled="!questions.length"
              @click="reset"
            >
              reset
            </Button>
          </div>
        </div>
      </div>
    </header>

    <template v-if="!questions.length">
      <div class="flex items-center justify-center h-full">
        <div class="flex gap-2 flex-col items-center justify-center">
          <LoaderCircle class="size-16 animate-spin stroke-1" />
          <span class="text-muted-foreground text-sm">generating...</span>
        </div>
      </div>
    </template>

    <template v-if="state === 'testing'">
      <div v-if="currentQuestion" class="px-12 py-8 grid gap-10">
        <Progress :model-value="progress" class="h-1" />

        <div class="min-h-52">
          <QuestionFillBlank v-if="currentQuestion.type === 'fill_blank'" :question="currentQuestion" />
          <QuestionMultipleChoice v-else-if="currentQuestion.type === 'multiple_choice'" :question="currentQuestion" />
          <QuestionTrueFalse v-else-if="currentQuestion.type === 'true_false'" :question="currentQuestion" />
        </div>

        <div class="flex justify-between">
          <Button
            variant="secondary"
            :disabled="currentId <= 0"
            @click="currentId--"
          >
            previous
          </Button>
          <Button
            variant="secondary"
            :disabled="currentId >= questions.length - 1"
            @click="currentId++"
          >
            next
          </Button>
        </div>
      </div>
    </template>

    <template v-if="state === 'submitted'">
      <ScrollArea class="h-[80vh]">
        <div class="px-16 py-8 grid gap-10">
          <p class="text-center underline underline-offset-4">
            Score: {{ score }}/{{ questions.length }}
          </p>
          <template
            v-for="q in questions"
            :key="q.id"
          >
            <QuestionFillBlank v-if="q.type === 'fill_blank'" :question="q" />
            <QuestionMultipleChoice v-else-if="q.type === 'multiple_choice'" :question="q" />
            <QuestionTrueFalse v-else-if="q.type === 'true_false'" :question="q" />
          </template>
        </div>
      </ScrollArea>
    </template>
  </div>
</template>
