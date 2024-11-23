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
const isExplained = ref(false)

const comp = computed(() => {
  const parts = props.question.question.split('[blank]')

  return h('div', {
    class: `space-x ${isTrue.value === true ? '[&>input]:border-success [&>input]:!ring-success' : ''}`,
  }, [
    h('span', { style: { whitespace: 'nowrap' } }, parts[0]),
    h(Input, {
      'class': 'inline h-8',
      'style': { width: `${props.question.answer.length * 2}ch` },
      'onUpdate:modelValue': (v) => {
        answer.value = `${v}`
        isTrue.value = undefined
        isExplained.value = false
      },
    }),
    h('span', { style: { whitespace: 'nowrap' } }, parts[1]),
  ])
})

async function ask() {
  if (isExplained.value)
    return

  explain.value = ''
  await $genStream(
    `Explain briefly and focus only on why the answer "${answer.value}" is ${
      check() ? 'correct' : 'incorrect'
    }. Do not provide feedback on or reference the question.`,
    (output) => {
      explain.value += output
    },
  )
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

    <component :is="comp" />
  </div>
</template>
