<script setup lang="ts">
import type { Question } from '~/utils/types'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'multiple_choice' }>
}>()

const answer = ref<string>()

function validate() {
  const isTrue = answer.value === props.question.answer
  return {
    nth: props.nth,
    isTrue,
    givenAnswer: answer.value,
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
    <div class="mb-2">
      {{ props.question.question }}
    </div>
    <RadioGroup v-model="answer" class="grid grid-cols-2 gap-3">
      <div
        v-for="(option, i) in props.question.options"
        :key="i"
        class="flex items-center space-x-2"
      >
        <RadioGroupItem :id="`question_${props.nth}_${i}`" :value="option" />
        <Label :for="`question_${props.nth}_${i}`">
          {{ String.fromCharCode(97 + i) }}: {{ option }}
        </Label>
      </div>
    </RadioGroup>
  </div>
</template>
