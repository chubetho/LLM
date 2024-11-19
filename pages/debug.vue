<script setup lang="ts">
import BasePageWrap from '~/components/BasePageWrap.vue'

const input = ref(``)

async function embedInput() {
  const response = await $embed(input.value)
  console.log(response)
}

async function generatePodcast() {
  const response = await $gen(`Base on this ${input.value}
  Generate for me a long podcast.`)
  console.log(response)
}

async function foo() {
  const embedding = await $embed(input.value)
  const response = await $fetch('/api/docs/find', {
    method: 'POST',
    body: {
      embedding,
    },
  })

  console.log(response)
}
</script>

<template>
  <BasePageWrap>
    <template #heading>
      debug
    </template>

    <div class="flex gap-4 flex-wrap">
      <Textarea v-model="input" class="min-h-80 grow" />

      <div class="flex gap-4">
        <Button @click="embedInput">
          embed
        </Button>

        <Button @click="generatePodcast">
          podcast
        </Button>

        <Button @click="foo">
          foo
        </Button>
      </div>
    </div>
  </BasePageWrap>
</template>
