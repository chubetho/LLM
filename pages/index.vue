<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next'

const { data: sets } = await useFetch('/api/sets')
const search = ref('')
const searchDebounced = debouncedRef(search, 500)

const { data: foundSets } = await useAsyncData('search', async () => {
  const embedding = await embed(searchDebounced.value)
  return $fetch('/api/sets/find', {
    method: 'POST',
    body: { embedding },
  })
}, {
  deep: false,
  lazy: true,
  watch: [searchDebounced],
})

const showSets = computed(() => foundSets.value || sets.value)
</script>

<template>
  <BasePageWrap>
    <template #heading>
      all quizzes
    </template>

    <div class="space-y-4 p-1">
      <div class="">
        <Input v-model="search" placeholder="search anything..." />
      </div>

      <ul class="grid gap-3 grid-cols-4">
        <li>
          <Card
            class="group hover:border-primary transition-colors cursor-pointer h-full flex items-center justify-center min-h-40"
            @click="navigateTo('/insert')"
          >
            <CirclePlus class="size-16 stroke-[0.5px] stroke-primary/60 group-hover:stroke-primary group-hover:stroke-[1px] transition-colors" />
          </Card>
        </li>
        <template v-if="showSets">
          <li v-for="set in showSets" :key="set.id">
            <NuxtLink class="group" :to="`/sets/${set.id}`">
              <Card class="group-hover:border-primary transition-colors h-full flex flex-col">
                <CardHeader>
                  <CardTitle>{{ set.name }}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul class="flex flex-wrap gap-1 pb-3">
                    <li v-for="tag in (typeof set.tags === 'string' ? JSON.parse(set.tags) as string[] : set.tags)" :key="tag">
                      <Badge variant="secondary">
                        {{ tag }}
                      </Badge>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter class="text-xs text-muted-foreground flex justify-between mt-auto">
                  <span>
                    Created at {{ set.createAt }}
                  </span>
                  <span>
                    ({{ set.cards.length }})
                  </span>
                </CardFooter>
              </Card>
            </NuxtLink>
          </li>
        </template>
      </ul>
    </div>
  </BasePageWrap>
</template>
