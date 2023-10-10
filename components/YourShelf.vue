<template>
    <div class="shelf yourShelf" >
        <div class="yourShelf-title-box">
            <h2 class="library-title">Your Collection</h2>
            <p class="yourShelf-description">Items can be added to your collection by selecting them in the library, and clicking Add to Collection.</p>
        </div>
        <div class="shelf-inner">
            <div class="section-wrapper" >
                <!-- <div class="section-outer"> -->
                <div class="section-title-box" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <h3 class="yourShelf-section-category">Items in your collection</h3>
                    <h3 class="yourShelf-section-value">{{ yourShelf ? yourShelf.length : 0 }}</h3>
                        <div class="section-shelf-box">
                            <!-- Shelf Box DO NOT DELETE -->
                        </div>
                </div>
                    <div class="section-inner" v-for="item in yourShelf" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                        <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="yourShelfItemBundle.agents"/>
                        <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="yourShelfItemBundle.books"/>
                        <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="yourShelfItemBundle.marks"/>
                    </div>
            </div>
        </div>
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
            scales,
            yourShelfItemBundle } = storeToRefs(referenceStore)



</script>

<style lang="scss" scoped>

</style>