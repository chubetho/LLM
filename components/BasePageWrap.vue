<script setup lang="ts"></script>

<template>
  <div>
    <header class="z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
      <h1 class="text-xl" data-allow-mismatch>
        <slot name="heading" />
      </h1>
    </header>

    <div class="h-full p-4">
      <slot />
    </div>
  </div>
</template>
