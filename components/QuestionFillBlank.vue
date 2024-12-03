<script setup lang="ts">
const props = defineProps<{
  question: Extract<Question, { type: 'fill_blank' }>
}>()

interface InjectType { questions: Ref<Question[]>, state: Ref<'testing' | 'submitted'> }
const context = inject<InjectType>('context', { questions: ref([]), state: ref('testing') })
const q = context.questions.value.find(x => x.id === props.question.id)
</script>

<template>
  <div v-if="q" class="grid gap-4">
    <h3 class="flex gap-2 text-lg">
      <span class="text-muted-foreground">#{{ props.question.id + 1 }}.</span>
      <span>{{ props.question.question }}</span>
    </h3>

    <Textarea
      v-model="q.input"
      placeholder="your answer..."
      :disabled="context.state.value === 'submitted'"
    />
  </div>
</template>
