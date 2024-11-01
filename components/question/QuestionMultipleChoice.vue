<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Question, QuestionAnswer } from '~/utils/types'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'multiple_choice' }>
}>()

const answer = ref('')
const isTrue = ref<boolean>()
const explain = ref('')

watch(answer, () => {
  isTrue.value = undefined
})

async function ask() {
  if (explain.value)
    return

  await chatStream(`Explain briefly why the answer "${answer.value}" is ${check() ? 'correct' : 'incorrect'} for: ${props.question.question}.`, (o) => {
    explain.value += o
  })
}

function validate(): QuestionAnswer {
  isTrue.value = check()

  return {
    nth: props.nth,
    isTrue: isTrue.value,
    givenAnswer: answer.value,
  }
}

function check() {
  return answer.value.toLowerCase() === props.question.answer.toLowerCase()
}

defineExpose({ validate })
</script>

<template>
  <div>
    <div class="mb-1 flex items-end gap-4">
      <span
        class="underline" :class="{
          'text-destructive': isTrue === false,
          'text-success': isTrue === true,
        }"
      >
        question {{ props.nth }}:
      </span>
      <Popover v-if="isTrue === false">
        <PopoverTrigger as="div">
          <Button
            size="xs" variant="secondary"
            @click="ask"
          >
            <Sparkle class="mr-1 size-3" /> ask
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" :side-offset="0">
          {{ explain }}
        </PopoverContent>
      </Popover>
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
        <RadioGroupItem
          :id="`question_${props.nth}_${i}`" :value="option"
          :class="{
            'border-success text-success': isTrue === true && answer === option,
            'border-destructive text-destructive': isTrue === false && answer === option,
          }"
        />
        <Label
          :for="`question_${props.nth}_${i}`"
          :class="{
            'text-success': isTrue === true && answer === option,
            'text-destructive': isTrue === false && answer === option,
          }"
        >
          {{ String.fromCharCode(97 + i) }}: {{ option }}
        </Label>
      </div>
    </RadioGroup>
  </div>
</template>
