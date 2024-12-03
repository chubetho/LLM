<script setup lang="ts">
const props = defineProps<{
  question: Extract<Question, { type: 'true_false' }>
}>()

interface InjectType { questions: Ref<Question[]>, state: Ref<'testing' | 'submitted'> }
const context = inject<InjectType>('context', { questions: ref([]), state: ref('testing') })
const q = context.questions.value.find(x => x.id === props.question.id)

function change(v: string) {
  if (context.state.value === 'submitted' || !q)
    return

  q.input = v
}
</script>

<template>
  <div v-if="q" class="grid gap-4">
    <h3 class="flex gap-2 text-lg">
      <span class="text-muted-foreground">#{{ props.question.id + 1 }}.</span>
      <span>{{ props.question.question }}</span>
    </h3>

    <ul class="grid grid-cols-2 gap-4">
      <li
        v-for="(o) in ['true', 'false']"
        :key="o"
      >
        <button
          class="block w-full text-left border p-4 rounded-lg transition-colors"
          :class="q.input === o ? 'bg-secondary border-primary' : 'hover:border-primary'"
          @click="change(o)"
        >
          {{ o }}
        </button>
      </li>
    </ul>
  </div>
</template>
