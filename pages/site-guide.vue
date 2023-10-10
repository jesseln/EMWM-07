<template>
    <div>
        <ViewDesigner v-if="viewStore.formattedLibrary.length" />
    </div>
</template>

<script setup>
  const libraryStore = useLibraryStore();
  const viewStore = useViewStore();
</script>

<style lang="scss" scoped>

</style>