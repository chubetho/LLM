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

const attempt = ref(1)
async function generate() {
  if (!set.value)
    return

  const systemPrompt = `
You are a knowledgeable teacher tasked with creating educational questions in JSON format. Your goal is to generate exactly ${
  set.value.cards.length * 2
} questions based on the user's flashcard data. Ensure all questions are structured properly and follow the format below:

### JSON Structure:
{
  "questions": [
    {
      "type": "string", // One of: "fill_blank", "multiple_choice", "true_false".
      "question": "string", // The question text in plain English. For "fill_blank", include the answer as a placeholder (e.g., "The capital of France is ___").
      "answer": "string", // The correct answer. For "true_false", it must be "true" or "false".
      "options": ["string", "string", "string", "string"] // Required only for "multiple_choice". Provide exactly 4 options.
    },
    ...
  ]
}

### Instructions:
1. **General Requirements**:
   - Each question must include "type", "question", and "answer".
   - Ensure all fields are non-empty and formatted correctly.
   - Base all questions on the user's flashcard data, ensuring accuracy and relevance.
   - Validate that all questions comply with the provided structure before submitting the JSON object.

2. **Question Types**:
   - **"fill_blank"**:
     - Include the answer as a placeholder in the question text (e.g., "The capital of France is ___").
     - Ensure the placeholder aligns with the correct answer.
   - **"multiple_choice"**:
     - Provide exactly 4 unique and relevant options, one of which must be the correct answer.
     - Example: "What is the capital of France?" with options ["Paris", "London", "Rome", "Berlin"].
   - **"true_false"**:
     - The answer must strictly be either "true" or "false".
     - Example: "The Earth revolves around the Sun."

3. **Validation**:
   - Ensure the generated JSON object is properly formatted and adheres to the specified structure.
   - Avoid any additional or unnecessary fields outside the defined structure.
   - Include only content relevant to the flashcard data provided by the user.

4. **Output Format**:
   - Respond with a single JSON object containing the "questions" array.
   - Do not include any text or explanation outside the JSON object.
   - Ensure your response is clear, concise, and adheres strictly to the requirements.

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

### Additional Notes:
- Ensure variety in question types and alignment with the flashcard content.
- Focus on generating high-quality educational questions that align with the user's flashcards.
- Do not include explanations, comments, or text outside the JSON object.
`

  const res = await $chatFast(
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
    { format: 'json' },
  )

  const parsed = JSON.parse(res)
  const zodSchema = z.object({ questions: z.array(questionSchema) })
  const { data, error } = zodSchema.safeParse(parsed)

  if (error) {
    console.error('Invalid data:', parsed)
    attempt.value++
    generate()
    return
  }

  questions.value = data.questions.map((q, id) => ({ ...q, id, input: undefined }))
  console.log(questions.value)
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
        <div class="flex gap-4 flex-col items-center justify-center">
          <LoaderCircle class="size-16 animate-spin stroke-1" />
          <span class="text-muted-foreground text-sm">attempt {{ attempt }}</span>
        </div>
      </div>
    </template>

    <template v-if="state === 'testing'">
      <div v-if="currentQuestion" class="px-12 py-8 grid gap-10">
        <Progress :model-value="progress" class="h-1" />

        <div class="min-h-52">
          <KeepAlive>
            <QuestionFillBlank v-if="currentQuestion.type === 'fill_blank'" :question="currentQuestion" />
            <QuestionMultipleChoice v-else-if="currentQuestion.type === 'multiple_choice'" :question="currentQuestion" />
            <QuestionTrueFalse v-else-if="currentQuestion.type === 'true_false'" :question="currentQuestion" />
          </KeepAlive>
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
