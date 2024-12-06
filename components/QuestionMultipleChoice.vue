<script setup lang="ts">
const props = defineProps<{
  question: Extract<Question, { type: 'multiple_choice' }>
}>()

interface InjectType { questions: Ref<Question[]>, state: Ref<'testing' | 'submitted'> }
const context = inject<InjectType>('context', { questions: ref([]), state: ref('testing') })
const q = context.questions.value.find(x => x.id === props.question.id)

function change(v: string) {
  if (!q)
    return

  q.input = v
}

const textClass = computed(() => {
  if (!q || context.state.value === 'testing')
    return ''

  if (q.input === q.answer)
    return 'text-green-600 dark:text-green-700'

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

    <ul class="grid grid-cols-2 gap-4">
      <li
        v-for="(o, i) in props.question.options"
        :key="o"
      >
        <button
          v-if="context.state.value === 'testing'"
          class="flex size-full text-left border p-4 rounded-lg transition-colors"
          :class="
            [
              q.input === o ? 'bg-secondary border-primary' : 'hover:border-primary',
            ]"
          @click="change(o)"
        >
          {{ i === 0 ? 'A' : i === 1 ? 'B' : i === 2 ? 'C' : 'D' }}: {{ o }}
        </button>

        <button
          v-if="context.state.value === 'submitted'"
          class="flex size-full text-left border p-4 rounded-lg transition-colors"
          :class="
            [
              o === q.answer ? 'ring ring-green-600 dark:ring-green-800' : '',
              o === q.input && q.input !== q.answer ? 'ring ring-destructive' : '',
            ]"
        >
          {{ i === 0 ? 'A' : i === 1 ? 'B' : i === 2 ? 'C' : 'D' }}: {{ o }}
        </button>
      </li>
    </ul>
  </div>
</template>
