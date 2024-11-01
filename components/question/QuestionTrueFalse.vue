<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Question, QuestionAnswer } from '~/utils/types'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'true_false' }>
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
      <div class="flex items-center space-x-2">
        <RadioGroupItem
          :id="`question_${props.nth}_true`" value="true"
          :class="{
            'border-success text-success': isTrue === true && answer === 'true',
            'border-destructive text-destructive': isTrue === false && answer === 'true',

          }"
        />
        <Label
          :for="`question_${props.nth}_true`"
          :class="{
            'text-success': isTrue === true && answer === 'true',
            'text-destructive': isTrue === false && answer === 'true',
          }"
        >
          true
        </Label>
      </div>
      <div class="flex items-center space-x-2">
        <RadioGroupItem
          :id="`question_${props.nth}_false`" value="false"
          :class="{
            'border-success text-success': isTrue === true && answer === 'false',
            'border-destructive text-destructive': isTrue === false && answer === 'false',
          }"
        />
        <Label
          :for="`question_${props.nth}_false`"
          :class="{
            'text-success': isTrue === true && answer === 'false',
            'text-destructive': isTrue === false && answer === 'false',
          }"
        >
          false
        </Label>
      </div>
    </RadioGroup>
  </div>
</template>
