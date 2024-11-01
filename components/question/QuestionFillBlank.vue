<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Question, QuestionAnswer } from '~/utils/types'
import Input from '../ui/input/Input.vue'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'fill_blank' }>
}>()

const emit = defineEmits<{
  ask: [nth: number ]
}>()

const id = computed(() => `question_${props.nth}_input`)
const answer = ref('')
const error = ref('')

const showQuestion = computed(() => {
  const parts = props.question.question.split('[blank]')

  return h('div', { class: 'flex items-center gap-1' }, [
    h('span', null, parts[0]),
    h(Input, { 'id': id.value, 'style': { width: `${props.question.answer.length * 2}ch` }, 'onUpdate:modelValue': (v) => {
      answer.value = `${v}`
      error.value = ''
    } }),
    h('span', null, parts[1]),
  ])
})

function validate(): QuestionAnswer {
  const isTrue = answer.value?.toLowerCase() === props.question.answer.toLowerCase()
  error.value = isTrue ? '' : 'Incorrect answer'

  return {
    nth: props.nth,
    isTrue,
    givenAnswer: answer.value,
  }
}

defineExpose({ validate })
</script>

<template>
  <div>
    <div class="mb-1 underline">
      question {{ props.nth }}:
    </div>
    <component :is="showQuestion" />
    <div v-if="error" class="flex items-center mt-1 gap-2">
      <span class="text-destructive">{{ error }}</span>
      <Button
        size="xs" variant="outline"
        @click="emit('ask', props.nth)"
      >
        <Sparkle class="mr-1 size-3" /> ask
      </Button>
    </div>
  </div>
</template>
