<script setup lang="ts">
import type { Question } from '~/utils/types'
import Input from '../ui/input/Input.vue'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'fill_blank' }>
}>()

const id = computed(() => `question_${props.nth}_input`)

const showQuestion = computed(() => {
  const parts = props.question.question.replace(/_+/g, '[blank]').split('[blank]')

  return h('div', { class: 'flex items-center gap-1' }, [
    h('span', null, parts[0]),
    h(Input, { id: id.value, style: { width: `${props.question.answer.length * 2}ch` } }),
    h('span', null, parts[1]),
  ])
})

function validate() {
  const el = document.getElementById(id.value) as HTMLInputElement
  if (!el) {
    return { nth: props.nth, isTrue: false, answer: '' }
  }

  return {
    nth: props.nth,
    isTrue: el.value === props.question.answer,
    givenAnswer: el.value,
    correctAnswer: props.question.answer,
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
  </div>
</template>
