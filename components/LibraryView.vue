<template>
    <div class="shelf" v-for="shelf in formattedLibrary" :key="shelf">
        <div class="shelf-title-box">
            <h2 class="shelf-title">{{shelf[0]}}</h2>
        </div>
        <div class="shelf-inner">
            <div class="section-wrapper" v-for="bookend in shelf[1]" :key="bookend" >
                <div class="section-title-box" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <h3 class="section-category">{{ categoryMap.get(libraryDisplay.viewType.bookend)[libraryDisplay.view.bookend] }}</h3>
                    <h3 class="section-value">{{ bookend[0] }}</h3>
                    <div class="section-shelf-box">
                    <!-- Shelf Box DO NOT DELETE -->
                    </div>
                </div>
                    <div class="section-inner" v-for="item in bookend[1]" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                        <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="libraryItemBundle.Agent"/>
                        <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="libraryItemBundle.Book"/>
                        <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="libraryItemBundle.Mark"/>
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
            libraryItemBundle } = storeToRefs(referenceStore)



    //Kept due to temporary use in template.
    const isHighlight = ref(false);

</script>

<style lang="scss" scoped>

</style>