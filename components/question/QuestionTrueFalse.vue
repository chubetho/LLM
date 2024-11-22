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
const isExplained = ref(false)

watch(answer, () => {
  isTrue.value = undefined
  isExplained.value = false
})

async function ask() {
  if (isExplained.value)
    return

  explain.value = ''
  await $genStream(`Explain briefly why the answer "${answer.value}" is ${check() ? 'correct' : 'incorrect'} for: ${props.question.question}.`, (o) => {
    explain.value += o
  })
  isExplained.value = true
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
      <Popover v-if="isTrue !== undefined">
        <PopoverTrigger as="div">
          <Button
            size="xs" variant="secondary"
            @click="ask"
          >
            <Sparkle class="mr-1 size-3" /> ask
          </Button>
        </PopoverTrigger>
        <PopoverContent side="right" :side-offset="10" class="w-96">
          {{ explain }}
        </PopoverContent>
      </Popover>
    </div>

    <div class="mb-2">
      {{ props.question.question }}
    </div>
    <RadioGroup v-model="answer" class="grid grid-cols-2 gap-3">
      <div
        v-for="(option, i) in ['true', 'false']"
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
          {{ option }}
        </Label>
      </div>
    </RadioGroup>
  </div>
</template>
