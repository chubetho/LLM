<script setup lang="ts">
// const { data } = await useFetch('/api/youtube')
// console.log(data)
const url = ref('')
const response = ref('')

async function submit() {
  const _url = URL.parse(url.value)
  if (!_url)
    return

  const v = _url.searchParams.get('v')
  if (!v)
    return

  response.value = await $fetch('/api/youtube/transcripts', {
    method: 'POST',
    body: { v },
  })
}
</script>

<template>
  <div>
    <form class="p-4" @submit.prevent="submit">
      <Label>link</Label>
      <Input v-model="url" placeholder="https://www.youtube.com/watch?v=<id>" />
      <Button size="sm">
        submit
      </Button>
    </form>

    <pre>
      {{ response }}
    </pre>
  </div>
</template>
