<template>
    <div >
      <!-- <div class="home-header">
        <h2 class="home-header-title">The Library of Libraries</h2>
      </div> -->
      <!-- <ViewSidebar /> -->
        <div v-if="viewStore.formattedLibrary.length">
          <!-- <LibraryContainer :agents="libraryStore.agents" :books="libraryStore.books" :marks="libraryStore.marks" /> -->
          <LibraryContainer :books="libraryStore.books"/>
        </div>
        <button @click="showAnnotations=!showAnnotations" class="annotation-button" :class="{ 'active': showAnnotations }">
            🖊️
        </button>
        <AnnotationPanel v-if="showAnnotations"/>
    </div>
   
    
  </template>
  
  <script setup>


  //Library State
  const libraryStore = useLibraryStore();
  //View State
  const viewStore = useViewStore();
//   const { width, height } = useWindowSize()
  const showAnnotations = ref(false)

  </script>
  
  <style scoped>
  

  </style>