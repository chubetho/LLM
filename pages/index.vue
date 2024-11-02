<script setup lang="ts">
import { CirclePlus } from 'lucide-vue-next'
import BasePageWrap from '~/components/BasePageWrap.vue'

const { data: sets } = await useFetch('/api/sets')
</script>

<template>
  <BasePageWrap>
    <template #heading>
      all quizzes
    </template>

    <ul class="grid gap-3 grid-cols-4">
      <li>
        <Card
          class="group hover:border-primary transition-colors cursor-pointer h-full flex items-center justify-center"
          @click="navigateTo('/insert')"
        >
          <CirclePlus class="size-16 stroke-[0.5px] stroke-primary/60 group-hover:stroke-primary group-hover:stroke-[1px] transition-colors" />
        </Card>
      </li>
      <template v-if="sets">
        <li v-for="set in sets" :key="set.id">
          <NuxtLink class="group" :to="`/sets/${set.id}`">
            <Card class="group-hover:border-primary transition-colors h-full flex flex-col">
              <CardHeader>
                <CardTitle>{{ set.name }}</CardTitle>
              </CardHeader>
              <CardContent>
                <ul class="flex flex-wrap gap-1 pb-3">
                  <li v-for="tag in set.tags" :key="tag">
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
  </BasePageWrap>
</template>
