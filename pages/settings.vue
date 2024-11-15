<script setup lang="ts">
const models = await $list()

const toolsOpts = models.tools.map(m => ({
  label: `${m.shortname}:${m.parameter_size} ${m.quantization_level}`,
  value: m.name,
}))

const toolsProfileOpts = [
  {
    name: 'creative',
    temperature: 1.2,
    topK: 100,
    topP: 0.95,
  },
  {
    name: 'default',
    temperature: 0.8,
    topK: 40,
    topP: 0.9,
  },
  {
    name: 'concise',
    temperature: 0.4,
    topK: 20,
    topP: 0.8,
  },
  {
    name: 'custom',
    temperature: 0,
    topK: 0,
    topP: 0,
  },
] as const

const toolsConfig = useLocalStorage('llm_tools', {
  name: 'llama3.1:8b',
  profile: 'default' as typeof toolsProfileOpts[number]['name'],
  temperature: 0.8,
  topK: 40,
  topP: 0.9,
})

watch([
  () => toolsConfig.value.temperature,
  () => toolsConfig.value.topK,
  () => toolsConfig.value.topP,
], ([te, tk, tp]) => {
  const p = toolsProfileOpts.find(p => p.temperature === te && p.topK === tk && p.topP === tp)
  if (!p)
    toolsConfig.value.profile = 'custom'
})

watch(() => toolsConfig.value.profile, (v) => {
  const conf = toolsProfileOpts.find(p => p.name === v)
  if (!conf)
    return

  switch (v) {
    case 'creative':
    case 'default':
    case 'concise':{
      toolsConfig.value.temperature = conf.temperature
      toolsConfig.value.topK = conf.topK
      toolsConfig.value.topP = conf.topP
      break
    }

    case 'custom': break
  }
})
</script>

<template>
  <BasePageWrap>
    <template #heading>
      settings
    </template>

    <div class="grid h-full flex-1 gap-4 overflow-auto grid-cols-3">
      <div class="relative flex h-full flex-col items-start gap-8">
        <form class="grid w-full items-start gap-6">
          <fieldset class="grid gap-6 rounded-lg border p-4">
            <legend class="-ml-1 px-1 text-sm font-medium">
              tools
            </legend>

            <Select v-model="toolsConfig.name">
              <SelectTrigger id="tools_name">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem
                  v-for="o in toolsOpts"
                  :key="o.value"
                  :value="o.value"
                >
                  {{ o.label }}
                </SelectItem>
              </SelectContent>
            </Select>

            <div class="grid gap-3">
              <Label for="tools_profile">profile</Label>

              <Select v-model="toolsConfig.profile">
                <SelectTrigger id="tools_profile">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem
                    v-for="o in toolsProfileOpts"
                    :key="o.name"
                    :value="o.name"
                  >
                    {{ o.name }}
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div class="grid grid-cols-3 gap-4">
              <div class="grid gap-3">
                <Label for="tools_temperature">temperature</Label>
                <Input id="tools_temperature" v-model="toolsConfig.temperature" type="number" min="0" step="0.1" />
              </div>
              <div class="grid gap-3">
                <Label for="tools_top-k">top k</Label>
                <Input id="tools_top-k" v-model="toolsConfig.topK" type="number" min="1" step="1" />
              </div>
              <div class="grid gap-3">
                <Label for="tools_top-p">top p</Label>
                <Input id="tools_top-p" v-model="toolsConfig.topP" type="number" min="0" step="0.05" max="1" />
              </div>
            </div>
          </fieldset>

          <!-- <fieldset class="grid gap-6 rounded-lg border p-4">
            <legend class="-ml-1 px-1 text-sm font-medium">
              Messages
            </legend>
            <div class="grid gap-3">
              <Label for="role">Role</Label>
              <Select default-value="system">
                <SelectTrigger>
                  <SelectValue placeholder="Select a role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="system">
                    System
                  </SelectItem>
                  <SelectItem value="user">
                    User
                  </SelectItem>
                  <SelectItem value="assistant">
                    Assistant
                  </SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div class="grid gap-3">
              <Label for="content">Content</Label>
              <Textarea
                id="content"
                placeholder="You are a..."
                class="min-h-[9.5rem]"
              />
            </div>
          </fieldset> -->
        </form>
      </div>
    </div>
  </BasePageWrap>
</template>
