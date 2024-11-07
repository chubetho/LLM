<script setup lang="ts">
import BasePageWrap from '~/components/BasePageWrap.vue'

const input = ref(`Base on this is a transcript of an interview with Leopoldo López, a Venezuelan politician who was imprisoned and later released. Here's a summary: The Story of the Hawk Leopoldo shares a personal anecdote about spending hours contemplating a hawk in a tree while he was in prison. The guards told him that the hawk had been injured by barbed wire, but Leopoldo insisted on caring for it himself. When the guards eventually brought the hawk to his cell, he fed and cared for it until it was taken away by authorities. However, to his surprise, the hawk returned to its perch in the tree just a day later. The Message of Hope Leopoldo draws parallels between the hawk's resilience and the Venezuelan people's ability to persevere despite adversity. He says that even when all seems lost, there is always hope for freedom and change. This message of hope inspires him to continue fighting for democracy and human rights in Venezuela. Current Situation in Venezuela When asked about the recent elections, Leopoldo explains that Maduro has been using electoral autocracy to maintain power. He shares that his movement had a candidate, Edmundo González, who won with 70% of the vote, but Maduro stole the election and arrested many opposition leaders, including himself. Today, there are over 2,500 political prisoners in Venezuela. The Significance of Today Leopoldo mentions that today is a special day because it marks the fourth anniversary of his reunion with his family, who were waiting for him in Spain after he escaped from prison. Overall, this interview conveys Leopoldo's unwavering optimism and determination to fight for democracy and human rights in Venezuela.`)

async function embedInput() {
  const response = await embed(input.value)
  console.log(response)
}

async function generatePodcast() {
  const response = await chat(`${input.value}
  Generate for me a long podcast.`)
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
      </div>
    </div>
  </BasePageWrap>
</template>
