<script setup lang="ts">
const props = defineProps<{
  question: Extract<Question, { type: 'true_false' }>
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
    return 'text-green-400 dark:text-green-700'

  return ''
})

const { ask, explanation } = useQuestionAsk(q)
</script>

<template>
  <div v-if="q" class="grid gap-4">
    <h3 class="flex gap-2 text-lg items-center">
      <span :class="textClass ?? 'text-muted-foreground'">#{{ props.question.id + 1 }}.</span>
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
        v-for="(o) in ['true', 'false']"
        :key="o"
      >
        <button
          v-if="context.state.value === 'testing'"
          class="block w-full text-left border p-4 rounded-lg transition-colors"
          :class="q.input === o ? 'bg-secondary border-primary' : 'hover:border-primary'"
          @click="change(o)"
        >
          {{ o }}
        </button>

        <button
          v-if="context.state.value === 'submitted'"
          class="block w-full text-left border p-4 rounded-lg transition-colors"
          :class="
            [
              o === q.answer ? 'bg-green-400 dark:bg-green-700/60 border-primary' : '',
              o === q.input && q.input !== q.answer ? 'bg-destructive border-primary' : '',
            ]"
        >
          {{ o }}
        </button>
      </li>
    </ul>
  </div>
</template>
