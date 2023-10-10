<template>
    <div>
    <div class="query-box">
        <h1 class="query-type"> {{ libraryDisplay.pageText.queryType }} </h1>
        <h2 class="query-breadcrumb"> {{ libraryDisplay.pageText.queryBreadcrumb }}</h2>
        <h2 class="query-breadcrumb">Total Items: {{ dataSize }}</h2>
    </div>
    <div class="shelf-separator-container"><div class="shelf-separator"></div></div>
    <div class="nav-div">
        <LibraryNav />
    </div>
    <div class="library-type-title-box">
        <h1 class="library-type-title">{{ libraryDisplay.pageText.libraryTypeTitle }}</h1>
        <p class="library-type-subtitle">{{ libraryDisplay.pageText.libraryTypeSubtitle }}</p>
    </div>
    <div v-if="dataCheck">
        <LibraryView />
    </div>

    <button @click="showAnnotations=!showAnnotations" class="annotation-button" :class="{ 'active': showAnnotations }">
        🖊️
    </button>
    <AnnotationPanel v-if="showAnnotations"/>
    <button ref="toTopButton" @click="scrollToTop" class="to-top-button">☝️</button>


    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

// ROUTE MANAGERS
const route = useRoute()

// STATE MANAGERS IMPORT //    

//Library State
const libraryStore = useLibraryStore();

//View State
const viewStore = useViewStore();
const { libraryData,
        libraryDisplay,
        dataSize,
        formattedLibrary, 
        itemHeight,
        itemColour, 
        viewHeightBounds, 
        viewColourSet } = storeToRefs(viewStore)
const { parseDatabase,
        handleViewSelection,
        getIDP,
        itemTypeCheck } = useViewStore();


//Your Shelf State
const yourShelfStore = useYourShelfStore();
const { yourShelf }  = storeToRefs(yourShelfStore)
const { addToShelf, 
        removeFromShelf } = useYourShelfStore();

//Reference Constants
const referenceStore = useReferenceStore();
const { categoryMap, 
        invCategoryMap, 
        colourMapFiltered,
        scales,
        viewRouteQueries,
        viewEditItemBundle,
        viewColourItemBundle } = storeToRefs(referenceStore)


    const setQueryView = referenceStore.viewRouteQueries[route.params.setQuery]
    console.log("setQueryView", setQueryView)
    console.log("viewStore", viewStore.libraryDisplay)
    console.log("query check", setQueryView.view.itemType)
    Object.assign(viewStore.libraryDisplay.view, setQueryView.view)
    Object.assign(viewStore.libraryDisplay.viewType, setQueryView.viewType)
    Object.assign(viewStore.libraryDisplay.pageText, setQueryView.pageText)

//    console.log('library display', viewStore.libraryDisplay)
//    console.log('computed ', formattedLibrary)
//    console.log('computed length', formattedLibrary.length !== undefined)
   
   const dataCheck = computed (() => {
        return formattedLibrary.value.length !== undefined
    })

    watchEffect(()=>{
        parseDatabase(libraryStore[viewStore.libraryDisplay.view.itemType])
        // console.log('watchEffect',formattedLibrary)
    })

    // Error Page
    // if(route.params.setQuery !== 'myQuery'){
    //     throw createError({ statusCode: 404, statusMessage: "View not Found"})
    // }


    const showAnnotations = ref(false)

    // To Top Button
    const { x, y } = useWindowScroll() // To replace below
    const useX = x
    const useY = y
    const toTopButton = ref();
    onMounted(() => {
        watchEffect(()=>{
            if (useY.value > 550) {
                toTopButton.value.classList.add("showButton");
            } else {
                toTopButton.value.classList.remove("showButton");
            }
        })
    })
    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };



</script>

<style lang="scss" scoped>
    .nav-div{
        z-index: 5;
        position: sticky;
        top: 0;
        background-color: white;
        width: 100%;
        opacity: 100%;
    }

    // .nav-div:hover{
    //     opacity: 100%;
    // }
</style>