<script setup lang="ts">
import { ArrowLeft, Disc3 } from 'lucide-vue-next'
import QuestionFillBlank from '~/components/question/QuestionFillBlank.vue'
import QuestionMultipleChoice from '~/components/question/QuestionMultipleChoice.vue'
import QuestionTrueFalse from '~/components/question/QuestionTrueFalse.vue'
import type { CarouselApi } from '~/components/ui/carousel'
import type { Set } from '~/db'
import type { Question, QuestionAnswer } from '~/utils/types'

const route = useRoute('sets-id')
const setId = route.params.id
const { data: set } = await useFetch<Set>(`/api/sets/${setId}`)

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

const isTesting = ref(false)

const questions = shallowRef<Question[]>([])
const questionRefs = ref<(
  InstanceType<typeof QuestionFillBlank>
  | InstanceType<typeof QuestionMultipleChoice>
  | InstanceType<typeof QuestionTrueFalse>
)[]>([])
const answers = ref<QuestionAnswer[]>([])

async function generate() {
  if (!set.value)
    return

  isTesting.value = true

  const response = await chat(`
Using the following flashcards: ${JSON.stringify(set.value.cards)},
generate a JSON object with a "questions" key containing an array of questions in these formats:

1. **Fill-in-the-blank**: {"type": "fill_blank", "question": "<sentence with '[blank]' as a placeholder for the answer>", "answer": "<correct answer>"}.
2. **Multiple-choice**: {"type": "multiple_choice", "question": "<question>", "options": ["<option1>", "<option2>", "<option3>", "<option4>"], "answer": "<correct option>"}.
3. **True/False**: {"type": "true_false", "question": "<question>", "answer": "<true or false>"}.

Make sure questions are directly based on the flashcard content, clear, and formatted in plain text without any HTML, markup, or special formatting. Each question type should appear at least twice.`, { format: 'json' })

  const _questions = JSON.parse(response).questions as Question[]
  for (const q of _questions) {
    if (q.type === 'fill_blank') {
      q.question = q.question.replace(/_+/g, '[blank]')
    }
    else if (q.type === 'true_false') {
      q.answer = `${q.answer}`.toLowerCase()
    }
  }
  questions.value = _questions
  console.log(questions.value)
}

function cancel() {
  abort()
  isTesting.value = false
}

function submit() {
  answers.value = []
  for (const q of questionRefs.value) {
    answers.value.push(q.validate())
  }
}

async function ask(nth: number) {
  const answer = answers.value[nth - 1]
  if (answer.isTrue) {
    return
  }

  const question = questions.value[nth - 1]
  const response = await chat(`I answered "${answer.givenAnswer}" to question "${question.question}". Can you explain why this answer might be incorrect?`)

  console.log(response)
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      <div class="flex items-center gap-2 flex-wrap">
        <NuxtLink to="/" class="inline-flex items-center gap-2 transition-transform hover:-translate-x-1">
          <ArrowLeft class="size-4" />
          <span>{{ set?.name ?? 'not found' }}</span>
        </NuxtLink>
      </div>
    </template>

    <div v-if="set">
      <div class="flex items-center gap-1 mb-6">
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

      <ScrollArea
        v-if="isTesting"
        class="relative h-[75lvh] border rounded-lg pb-4 pt-6 px-2"
      >
        <div class="absolute top-4 right-4 flex gap-2">
          <Button
            v-if="questions.length"
            size="sm"
            @click="submit"
          >
            submit
          </Button>
          <Button
            variant="destructive" size="sm"
            @click="cancel"
          >
            cancel
          </Button>
        </div>

        <ul v-if="questions.length" class="grid gap-10 px-2 max-w-[80%]">
          <li
            v-for="(question, i) in questions"
            :key="i"
          >
            <QuestionFillBlank
              v-if="question.type === 'fill_blank'"
              ref="questionRefs"
              :question="question" :nth="i + 1"
              @ask="ask"
            />
            <QuestionMultipleChoice
              v-if="question.type === 'multiple_choice'"
              ref="questionRefs"
              :question="question" :nth="i + 1"
              @ask="ask"
            />
            <QuestionTrueFalse
              v-if="question.type === 'true_false'"
              ref="questionRefs"
              :question="question" :nth="i + 1"
              @ask="ask"
            />
          </li>
        </ul>
        <div
          v-else
          class="absolute inset-0 flex items-center justify-center"
        >
          <div class="animate-spin">
            <Disc3 class="size-16 stroke-1" />
          </div>
        </div>
      </ScrollArea>

      <template v-else>
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

          <div class="text-center text-sm">
            {{ current }}/{{ totalCount }}
          </div>
        </div>

        <div class="flex justify-center mt-4">
          <Button size="xs" @click="generate">
            generate tests
          </Button>
        </div>
      </template>
    </div>
  </BasePageWrap>
</template>
