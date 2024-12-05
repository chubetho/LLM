<script setup lang="ts">
const props = defineProps<{
  question: Extract<Question, { type: 'fill_blank' }>
}>()

interface InjectType { questions: Ref<Question[]>, state: Ref<'testing' | 'submitted'> }
const context = inject<InjectType>('context', { questions: ref([]), state: ref('testing') })
const q = context.questions.value.find(x => x.id === props.question.id)

const textClass = computed(() => {
  if (!q || context.state.value === 'testing')
    return ''

  if (q.input === q.answer)
    return 'text-green-400 dark:text-green-700'

  return ''
})

const { ask, explanation } = useQuestionAsk(q)
</script>

<template>
  <div v-if="q" class="grid gap-4">
    <h3 class="flex gap-2 text-lg items-start">
      <span :class="textClass || 'text-muted-foreground'">#{{ props.question.id + 1 }}.</span>
      <span :class="textClass">{{ props.question.question }}</span>
      <Popover v-if="context.state.value === 'submitted'">
        <PopoverTrigger as="div" class="ml-auto">
          <QuestionAskButton @click="ask" />
        </PopoverTrigger>
        <PopoverContent side="left" class="w-96">
          {{ explanation }}
        </PopoverContent>
      </Popover>
    </h3>

    <Textarea
      v-if="context.state.value === 'testing'"
      v-model="q.input"
      placeholder="your answer..."
    />

    <div
      v-if="context.state.value === 'submitted'"
      class="border p-4 rounded-lg border-primary"
      :class="
        [q.input === q.answer ? 'bg-green-400 dark:bg-green-700/60' : ' bg-destructive',
         q.input ? '' : 'text-muted-foreground',
        ]"
    >
      {{ q.input ?? 'no answer' }}
    </div>
  </div>
</template>
