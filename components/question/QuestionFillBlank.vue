<script setup lang="ts">
import { Sparkle } from 'lucide-vue-next'
import type { Question, QuestionAnswer } from '~/utils/types'
import Input from '../ui/input/Input.vue'

const props = defineProps<{
  nth: number
  question: Extract<Question, { type: 'fill_blank' }>
}>()

const answer = ref('')
const isTrue = ref<boolean>()
const explain = ref('')

const comp = computed(() => {
  const parts = props.question.question.split('[blank]')

  return h('div', { class: `flex items-center gap-1 ${isTrue.value === true ? '[&>input]:border-success [&>input]:!ring-success' : ''}` }, [
    h('span', { style: { whitespace: 'nowrap' } }, parts[0]),
    h(Input, {
      'style': { width: `${props.question.answer.length * 2}ch` },
      'onUpdate:modelValue': (v) => {
        answer.value = `${v}`
        isTrue.value = undefined
      },
    }),
    h('span', { style: { whitespace: 'nowrap' } }, parts[1]),
  ])
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

    <component :is="comp" />
  </div>
</template>
