<template>
    <div class="library-wrapper">
        <!-- <YourShelf /> -->
        <!-- <div class="shelf-separator-container"><div class="shelf-separator"></div></div> -->
        <!-- <ViewDesigner /> -->
        <!-- <div class="shelf-separator-container"><div class="shelf-separator"></div></div> -->
        <LibraryView />
        <button ref="toTopButton" @click="scrollToTop" class="to-top-button">☝️</button>
    </div>
</template>

<script setup>
    import { storeToRefs } from "pinia";
   
    // STATE MANAGERS IMPORT //    

    //View State
    const viewStore = useViewStore();
    const { libraryData,
            libraryDisplay,
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
            scales } = storeToRefs(referenceStore)

    //Bundle Object passed to Components
    const yourShelfItemBundle = computed (() => {
        return {
            yourShelfFunction: removeFromShelf,
            yourShelfText: 'Remove from Shelf',
            labelViewMode: 'label'
        }
    })

    // TESTERS
    // function testFunction(data, viewMode){
    //     console.log('testFunction', getIDP(data[0], viewMode))
    //     return 
    // }

    // TEST FUNCTION CALL  //
    // testFunction(parsedData.value, 'colour')
        


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

</style>