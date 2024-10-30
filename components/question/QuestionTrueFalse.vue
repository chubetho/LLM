<script setup lang="ts">
import type { Question } from '~/utils/types'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'true_false' }>
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
      <div class="flex items-center space-x-2">
        <RadioGroupItem :id="`question_${props.nth}_true`" value="true" />
        <Label :for="`question_${props.nth}_true`">true</Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem :id="`question_${props.nth}_false`" value="false" />
        <Label :for="`question_${props.nth}_false`">false</Label>
      </div>
    </RadioGroup>
  </div>
</template>
