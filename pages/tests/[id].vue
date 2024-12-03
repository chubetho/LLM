<script setup lang="ts">
import type { Question, Set } from '~/utils/types'
import { ArrowLeft } from 'lucide-vue-next'
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

async function generate() {
  if (!set.value)
    return

  //   const jsonSchema = `
  // {
  //   "questions": {
  //     "type": "array",
  //     "minItems": ${set.value.cards.length * 2},
  //     "items": {
  //       "type": "object",
  //       "properties": {
  //         "type": {
  //           "type": "string",
  //           "enum": ["fill_blank", "multiple_choice", "true_false"],
  //           "description": "Type of question."
  //         },
  //         "question": {
  //           "type": "string",
  //           "description": "The question text in plain English. For 'fill_blank' questions, the answer must be included in the question as a placeholder (e.g., 'The capital of France is ___')."
  //         },
  //         "answer": {
  //           "type": "string",
  //           "description": "The correct answer for the question.",
  //           "default": "",
  //           "anyOf": [
  //             {
  //               "type": "string",
  //               "enum": ["true", "false"],
  //               "description": "For 'true_false' type, the answer must be either 'true' or 'false'."
  //             },
  //             {
  //               "type": "string",
  //               "description": "For 'fill_blank' and 'multiple_choice', the answer is a freeform string."
  //             }
  //           ]
  //         },
  //         "options": {
  //           "type": "array",
  //           "description": "List of answer choices for 'multiple_choice' questions.",
  //           "minItems": 4,
  //           "maxItems": 4,
  //           "items": {
  //             "type": "string"
  //           }
  //         }
  //       },
  //       "required": ["type", "question", "answer"],
  //       "additionalProperties": false,
  //       "if": {
  //         "properties": {
  //           "type": { "const": "multiple_choice" }
  //         }
  //       },
  //       "then": {
  //         "required": ["options"]
  //       },
  //       "else": {
  //         "not": {
  //           "required": ["options"]
  //         }
  //       }
  //     }
  //   },
  // }`

  //   const systemPrompt = `
  // You are a teacher tasked with generating educational questions in JSON format. Create a JSON object containing exactly ${
  //   set.value.cards.length * 2
  // } questions based on the user's flashcard data. Your output must strictly follow this JSON schema:

  // ${jsonSchema}

  // ### Instructions:
  // - Each question must include a valid "type", "question", and "answer".
  // - For "fill_blank" questions:
  //   - The answer must appear in the question as a placeholder (e.g., 'The capital of France is ___').
  //   - Ensure the placeholder aligns with the correct answer.
  // - For "multiple_choice" questions:
  //   - Provide exactly 4 options.
  // - For "true_false" questions:
  //   - The answer must be either "true" or "false".
  // - All fields must be non-empty and consistent with the schema.
  // - Validate that all fields and nested structures adhere to the schema before finalizing the JSON.

  // ### Important:
  // - Base all questions on the user's provided flashcards.
  // - Ensure diversity in question types and relevance to the content.
  // `

  // const res = await $chatFast(
  //   [
  //     {
  //       role: 'system',
  //       content: systemPrompt,
  //     },
  //     {
  //       role: 'user',
  //       content: JSON.stringify(set.value.cards),
  //     },
  //   ],
  //   { format: 'json' },
  // )

  // const parsed = JSON.parse(res)
  const parsed = {
    questions: [
      {
        type: 'fill_blank',
        question: 'The capital of France is ___.',
        answer: 'Paris',
      },
      {
        type: 'multiple_choice',
        question: 'What is the capital of Italy?',
        options: [
          'Rome',
          'Paris',
          'London',
          'Berlin',
        ],
        answer: 'Rome',
      },
      {
        type: 'true_false',
        question: 'Is Crete the largest island in Greece?',
        answer: 'true',
      },
      {
        type: 'fill_blank',
        question: 'The river that flows through London is ___.',
        answer: 'Thames River',
      },
      {
        type: 'multiple_choice',
        question: 'What river flows through London?',
        options: [
          'Seine',
          'Rhine',
          'Thames River',
          'Danube',
        ],
        answer: 'Thames River',
      },
      {
        type: 'fill_blank',
        question: 'The highest mountain peak in Norway is ___.',
        answer: 'Galdhøpiggen',
      },
      {
        type: 'true_false',
        question: 'Is the capital of France located on an island?',
        answer: 'false',
      },
      {
        type: 'multiple_choice',
        question: 'What is the highest mountain peak in Norway?',
        options: [
          'Galdhøpiggen',
          'Mount Olympus',
          'K2',
          'Everest',
        ],
        answer: 'Galdhøpiggen',
      },
      {
        type: 'fill_blank',
        question: 'The capital of Italy is ___.',
        answer: 'Rome',
      },
      {
        type: 'true_false',
        question: 'Is Rome the largest city in Greece?',
        answer: 'false',
      },
    ],
  }
  const zodSchema = z.object({ questions: z.array(questionSchema).min(6) })
  const { data, error } = zodSchema.safeParse(parsed)

  if (error) {
    console.error('Invalid data:', parsed)
    throw new Error(error.message)
  }

  questions.value = data.questions.map((q, id) => ({ ...q, id, input: undefined }))
}
onMounted(() => {
  generate()
})

provide('context', { questions, state })

function submit() {
  state.value = 'submitted'
  console.log(questions.value)
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
            <Button @click="submit">
              submit
            </Button>
          </div>
        </div>
      </div>
    </header>

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
        <div class="px-12 py-8 grid gap-10">
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
