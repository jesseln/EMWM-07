<template>
    <VMenu
        placement="top" 
        :delay="{ show: 50, hide: 200 }"
        
    >
    <div class="item-wrapper" v-on="itemHandlers" :style="{ maxHeight: scales.maxItemHeight + 'px', height: itemHeight(getIDP(item,'height')) + 'px', width:scales.minItemWidth + 'px'}"> 

        <div class="agent-item-background" :style="{ maxHeight: scales.maxItemHeight + 'px', height: itemHeight(getIDP(item,'height')) + 'px',width:scales.minItemWidth + 4 + 'px'}"></div>

        <div class="agent-item" :style="{ maxHeight: scales.maxItemHeight-4 + 'px', height: itemHeight(getIDP(item,'height'))-4 + 'px' , background: itemColour(getIDP(item, 'colour')),
        width:scales.minItemWidth + 'px'}" :class="{lowlight: isHighlight}">


<div class="item-value" :style="{ color:  contrastHandler(itemColour(getIDP(item, 'colour')))}">
            <p >{{ getIDP(item, itemBundle.labelViewMode) }}</p>
        </div>
        </div>
    </div>
        <template #popper >
            <div class="item-menu-container scrollable">
            <div class="item-menu-header-container">
                <h2 class="item-menu-header">{{ itemBundle.menuHeader }}</h2>
                <h2 class="item-menu-subheader"> 
                    {{ handleObjectProperty(item, itemBundle.menuSubheader) }}
                </h2>
                <p class="item-menu-subheader-type">
                    {{categoryMap.get(itemBundle.itemType)[itemBundle.menuSubheader]}}
                </p>
            </div>
            <div class="item-menu">
                <div class="shelf-button-wrapper">
                    <button class="shelf-button" @click="itemBundle.yourShelfFunction(item)">{{itemBundle.yourShelfText}}</button>
                </div>
                <ul>
                    <li>
                        <h4>{{ categoryMap.get(itemBundle.itemType)[itemBundle.ownProp1]}}</h4>
                        <p>{{ handleObjectProperty(item, itemBundle.ownProp1) }}</p>
                    </li>
                    <li>
                        <h4>{{categoryMap.get(itemBundle.itemType)[itemBundle.ownProp2]}}</h4>
                        <p>{{ handleObjectProperty(item, itemBundle.ownProp2) }}</p>
                    </li>
                    <li>
                        <h4>{{categoryMap.get(itemBundle.itemType)[itemBundle.ownProp3]}}</h4>
                        <p>{{ handleObjectProperty(item, itemBundle.ownProp3) }}</p>
                    </li>
                    <li>
                        <h4>{{categoryMap.get(libraryDisplay.viewType[itemBundle.collectionProp1])[libraryDisplay.view[itemBundle.collectionProp1]]}}</h4>
                        <p>{{ getIDP(item, itemBundle.collectionProp1) }}</p>
                    </li>
                    <li>
                        <h4>{{categoryMap.get(libraryDisplay.viewType[itemBundle.collectionProp2])[libraryDisplay.view[itemBundle.collectionProp2]]}}</h4>
                        <p>{{ getIDP(item, itemBundle.collectionProp2) }}</p>
                    </li>
                </ul>
                <div class="item-view">
                <div class="item-view-header-container">
                    <h2 class="item-view-header">View Features</h2>
                </div>
                <ul>

                    <li>
                        <p class="item-view-subheader-type">{{itemBundle.viewProp1}}</p>
                        <h4>{{libraryDisplay.viewType[itemBundle.viewProp1] }}
                            |
                            {{ categoryMap.get(libraryDisplay.viewType[itemBundle.viewProp1])[libraryDisplay.view[itemBundle.viewProp1]] }}</h4>    
                        <h3>{{ getIDP(item, itemBundle.viewProp1) }}</h3>
                    </li>
                    <li>
                        <p class="item-view-subheader-type">{{itemBundle.viewProp2}}</p>
                        <h4>{{libraryDisplay.viewType[itemBundle.viewProp2] }}
                            |
                            {{ categoryMap.get(libraryDisplay.viewType[itemBundle.viewProp2])[libraryDisplay.view[itemBundle.viewProp2]] }}</h4>    
                        <h3>{{ getIDP(item, itemBundle.viewProp2) }}</h3>
                    </li>
                    <li>
                        <p class="item-view-subheader-type">{{itemBundle.viewProp3}}</p>
                        <h4>{{libraryDisplay.viewType[itemBundle.viewProp3] }}
                            |
                            {{ categoryMap.get(libraryDisplay.viewType[itemBundle.viewProp3])[libraryDisplay.view[itemBundle.viewProp3]] }}</h4>    
                        <h3>{{ getIDP(item, itemBundle.viewProp3) }}</h3>
                    </li>
                    <li>
                        <p class="item-view-subheader-type">{{itemBundle.viewProp4}}</p>
                        <h4>{{libraryDisplay.viewType[itemBundle.viewProp4] }}
                            |
                            {{ categoryMap.get(libraryDisplay.viewType[itemBundle.viewProp4])[libraryDisplay.view[itemBundle.viewProp4]] }}</h4>       
                        <h3>{{ getIDP(item, itemBundle.viewProp4) }}</h3>
                    </li>
                </ul>
            </div>
            </div>
        </div>
        </template>
    </VMenu>
    <div class="section-shelf-box">
    <!-- Shelf Box DO NOT DELETE -->
    </div>


</template>

<script setup>
import * as d3 from "d3";
import FloatingVue from 'floating-vue'
import 'floating-vue/dist/style.css'
import { storeToRefs } from "pinia";

//Props
const {item, itemBundle} = defineProps(['item', 'itemBundle']);

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

// COMPOPSABLES
//Utility Functions
const { handleObjectProperty,
        contrastHandler } = useUtils();


//Kept due to temporary use in template.
const isHighlight = ref(false);


// Event Handlers
const itemHandlers = {
  mouseover: handleMouseOver,
  mouseout: handleMouseOut
}

function handleMouseOver(d) {
    d3.select(d.currentTarget)
        .style('transform', getUpPos(d.currentTarget, true));
}

function handleMouseOut(d) {
    d3.select(d.currentTarget)
        .style('transform', getUpPos(d.currentTarget, false));
}

function getUpPos(elm, isUp) {
    if( elm.classList.contains('item-wrapper')){
    return `translate(0, ${(isUp ? -10 : 0)}px)`
    }
}

</script>

<style scoped>

</style>