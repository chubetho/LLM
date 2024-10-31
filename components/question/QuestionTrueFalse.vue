<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Question, QuestionAnswer } from '~/utils/types'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'true_false' }>
}>()

const emit = defineEmits<{
  ask: [nth: number ]
}>()

const answer = ref<string>()
const error = ref('')
const isTrue = computed(() => answer.value?.toLowerCase() === props.question.answer.toLowerCase())

function validate(): QuestionAnswer {
  error.value = isTrue.value ? '' : 'Incorrect answer'

  return {
    nth: props.nth,
    isTrue: isTrue.value,
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
