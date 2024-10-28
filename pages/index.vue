<script setup lang="ts">
import { Bird, CornerDownLeft, Mic, Rabbit, Turtle } from 'lucide-vue-next'
</script>

<template>
  <div class="grid h-full flex-1 gap-4 overflow-auto grid-cols-3">
    <div class="relative flex h-full flex-col items-start gap-8">
      <form class="grid w-full h-full  items-start gap-6">
        <fieldset class="grid gap-6 rounded-lg border p-4">
          <legend class="-ml-1 px-1 text-sm font-medium">
            Settings
          </legend>
          <div class="grid gap-3">
            <Label for="model">Model</Label>
            <Select>
              <SelectTrigger
                id="model"
                class="items-start [&_[data-description]]:hidden"
              >
                <SelectValue placeholder="Select a model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="genesis">
                  <div class="flex items-start gap-3 text-muted-foreground">
                    <Rabbit class="size-5" />
                    <div class="grid gap-0.5">
                      <p>
                        Neural
                        <span class="font-medium text-foreground">
                          Genesis
                        </span>
                      </p>
                      <p class="text-xs" data-description>
                        Our fastest model for general use cases.
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="explorer">
                  <div class="flex items-start gap-3 text-muted-foreground">
                    <Bird class="size-5" />
                    <div class="grid gap-0.5">
                      <p>
                        Neural
                        <span class="font-medium text-foreground">
                          Explorer
                        </span>
                      </p>
                      <p class="text-xs" data-description>
                        Performance and speed for efficiency.
                      </p>
                    </div>
                  </div>
                </SelectItem>
                <SelectItem value="quantum">
                  <div class="flex items-start gap-3 text-muted-foreground">
                    <Turtle class="size-5" />
                    <div class="grid gap-0.5">
                      <p>
                        Neural
                        <span class="font-medium text-foreground">
                          Quantum
                        </span>
                      </p>
                      <p class="text-xs" data-description>
                        The most powerful model for complex computations.
                      </p>
                    </div>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div class="grid gap-3">
            <Label for="temperature">Temperature</Label>
            <Input id="temperature" type="number" placeholder="0.4" />
          </div>
          <div class="grid grid-cols-2 gap-4">
            <div class="grid gap-3">
              <Label for="top-p">Top P</Label>
              <Input id="top-p" type="number" placeholder="0.7" />
            </div>
            <div class="grid gap-3">
              <Label for="top-k">Top K</Label>
              <Input id="top-k" type="number" placeholder="0.0" />
            </div>
          </div>
        </fieldset>
        <fieldset class="grid gap-6 rounded-lg border p-4">
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
        </fieldset>
      </form>
    </div>
    <div class="relative flex h-full min-h-[50vh] flex-col rounded-xl bg-muted/50 p-4 lg:col-span-2">
      <div class="flex-1" />
      <form class="relative overflow-hidden rounded-lg border bg-background focus-within:ring-1 focus-within:ring-ring">
        <Label for="message" class="sr-only">
          Message
        </Label>
        <Textarea
          id="message"
          placeholder="Type your message here..."
          class="min-h-12 resize-none border-0 p-3 shadow-none focus-visible:ring-0"
        />
        <div class="flex items-center p-3 pt-0">
          <Button variant="ghost" size="icon">
            <Mic class="size-4" />
            <span class="sr-only">Use Microphone</span>
          </Button>

          <Button type="submit" size="sm" class="ml-auto gap-1.5">
            Send
            <CornerDownLeft class="size-3.5" />
          </Button>
        </div>
      </form>
    </div>
  </div>
</template>
