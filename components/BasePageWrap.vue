<script setup lang="ts"></script>

<template>
  <div>
    <header class="z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <div class="text-xl grow" data-allow-mismatch>
        <slot name="heading" />
      </div>
    </header>

    <div class="h-full p-4 pr-0">
      <ScrollArea class="h-[80vh] pr-4 pb-8">
        <slot />
      </ScrollArea>
    </div>
  </div>
</template>
