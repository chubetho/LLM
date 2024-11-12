<script setup lang="ts">

</script>

<template>
  <BasePageWrap>
    <template #heading>
      summary document
    </template>

    <div class="flex gap-4 flex-col">
      <Tabs default-value="file">
        <TabsList class="grid w-full grid-cols-2">
          <TabsTrigger value="file">
            file
          </TabsTrigger>
          <TabsTrigger value="youtube">
            youtube
          </TabsTrigger>
        </TabsList>

        <TabsContent value="file">
          <DocumentFile />
        </TabsContent>

        <TabsContent value="youtube">
          <DocumentYoutube />
        </TabsContent>
      </Tabs>
    </div>
  </BasePageWrap>
</template>
