<template>
    <div class="yourShelf-title-box">
        <h2 class="library-title">Design Your Library View</h2>
        <p class="yourShelf-description">Select the options below to alter your view of the library.</p>
    </div>
    <div class="yourShelf-title-box">
        <h2 class="view-facet-title">Select Library Items to View</h2>
        <p class="view-facet-description">View the library by Agents, Books or Marks by clicking below.</p>
    </div>
        <div class="library-display-button-wrapper">
            <div class="library-button-wrapper">
                <button class="shelf-button library-button" @click="libraryItemDisplay('agents')" >Agents</button>
            </div>
            <div class="library-button-wrapper">
                <button class="shelf-button library-button" @click="libraryItemDisplay('books')" >Books</button>
            </div>
                <div class="library-button-wrapper">
                <button class="shelf-button library-button" @click="libraryItemDisplay('marks')" >Marks</button>
            </div>  
        </div>
    <!-- <div class="view-wrapper">
        <div class="view-facet-title-box">
            <h2 class="view-facet-title">Item Labels</h2>
            <p class="view-facet-description">Select the category to use as a label for each item.</p>
            <ViewSelector :viewMode="'label'" :selectionList="categoryMap"/>
        </div>
    <div class="shelf-inner">
        <div class="view-section-wrapper" >
                <div class="section-inner" v-for="item in viewHeightBounds" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="viewEditItemBundle.agents"/>
                    <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="viewEditItemBundle.books"/>
                    <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="viewEditItemBundle.marks"/>
                </div>
        </div>
    </div>
</div> -->
<div class="view-top-section-wrapper">
    <div class="view-wrapper">
        <div class="view-facet-title-box">
            <h2 class="view-facet-title">Item Height</h2>
            <p class="view-facet-description">Select the category which changes the height of each item.</p>
            <ViewSelector :viewMode="'height'" :selectionList="categoryMap"/>
        </div>
        <div class="view-shelf-inner">
            <div class="view-section-wrapper" >
                <!-- <div class="section-outer"> -->
                <div class="section-title-box" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <h3 class="view-section-category">Lowest Value </h3>
                    <h3 class="view-section-value">{{ `"${getIDP(viewHeightBounds[0], 'height')}"` }}</h3>
                    <div class="section-shelf-box">
                    <!-- Shelf Box DO NOT DELETE -->
                    </div>
                </div>
                    <div class="section-inner" v-for="item in viewHeightBounds" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                        <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="viewEditItemBundle.agents"/>
                        <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="viewEditItemBundle.books"/>
                        <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="viewEditItemBundle.marks"/>
                    </div>
                    <div class="view-section-title-box-rhs" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <h3 class="view-section-category">Highest Value </h3>
                    <h3 class="view-section-value">{{ `"${getIDP(viewHeightBounds[1], 'height')}"` }}</h3>
                    <div class="section-shelf-box">
                    <!-- Shelf Box DO NOT DELETE -->
                    </div>
                </div>
            </div>
        </div>
        </div>
        <div class="view-wrapper">
        <div class="view-facet-title-box">
            <h2 class="view-facet-title">Item Shelves</h2>
            <p class="view-facet-description">Select the category which divides the items into different shelves.</p>
            <ViewSelector :viewMode="'shelf'" :selectionList="categoryMap"/>
        </div>
        <div class="shelf-inner">
            <div class="view-section-wrapper" >
                    <div class="section-inner" v-for="item in viewHeightBounds" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                        <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="viewEditItemBundle.agents"/>
                        <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="viewEditItemBundle.books"/>
                        <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="viewEditItemBundle.marks"/>
                    </div>
            </div>
        </div>
        </div>
        <div class="view-wrapper">
        <div class="view-facet-title-box">
            <h2 class="view-facet-title">Item Arrangement</h2>
            <p class="view-facet-description">Select the category which orders the items on the shelf.</p>
            <ViewSelector :viewMode="'bookend'" :selectionList="categoryMap"/>
        </div>
        <!-- Add bookend here afterwards, create array -->
        <div class="shelf-inner">
            <div class="view-section-wrapper" >
                    <div class="section-inner" v-for="item in viewHeightBounds" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                        <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="viewEditItemBundle.agents"/>
                        <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="viewEditItemBundle.books"/>
                        <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="viewEditItemBundle.marks"/>
                    </div>
            </div>
        </div>
        </div>
    </div>
    <div class="view-wrapper">
    <div class="view-facet-title-box">
        <h2 class="view-facet-title">Item Colour</h2>
        <p class="view-facet-description">Select the category which sets the colours for each item.</p>
        <ViewSelector :viewMode="'colour'" :selectionList="colourMapFiltered"/>
    </div>
    <div class="shelf-inner">
        <div class="view-section-wrapper" >
            <div class="section-title-box" :style="{ height: scales.maxShelfHeight + 'px'}">
                <h3 class="yourShelf-section-category">Unique Categories</h3>
                <h3 class="yourShelf-section-value">{{ viewColourSet.size }}</h3>
                <div class="section-shelf-box">
                <!-- Shelf Box DO NOT DELETE -->
                </div>
            </div>
                <div class="section-inner" v-for="item in  viewColourSet" :key="JSON.stringify(item)" :style="{ height: scales.maxShelfHeight + 'px'}">
                    <AgentItem v-if="itemTypeCheck(item) === 'Agent'" :item="item" :itemBundle="viewColourItemBundle.agents"/>
                    <BookItem v-if="itemTypeCheck(item) === 'Book'" :item="item" :itemBundle="viewColourItemBundle.books"/>
                    <MarkItem v-if="itemTypeCheck(item) === 'Mark'" :item="item" :itemBundle="viewColourItemBundle.marks"/>
                </div>
        </div>
    </div>
    </div>
</template>

<script setup>
import { storeToRefs } from "pinia";

//Props
// const {viewMode} = defineProps(['viewMode']);


// STATE MANAGERS IMPORT //    

//Library State
const libraryStore = useLibraryStore();

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
        colourMapFiltered,
        scales,
        viewEditItemBundle,
        viewColourItemBundle } = storeToRefs(referenceStore)


//Kept due to temporary use in template.
const isHighlight = ref(false);

//Item Selection
function libraryItemDisplay(itemType){
    parseDatabase(libraryStore[itemType])
}


</script>

<style scoped>

</style>