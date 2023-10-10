<template>
    <div>
        <YourShelf />
        <button ref="toTopButton" @click="showAnnotations=!showAnnotations" class="annotation-button" :class="{ 'active': showAnnotations }">
            🖊️
        </button>
        <AnnotationPanel v-if="showAnnotations"/>
    </div>
    
</template>

<script setup>
  const showAnnotations = ref(false)

</script>

<style lang="scss" scoped>

</style>