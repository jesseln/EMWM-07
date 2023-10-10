<template>
    <div class="library-nav-container">
    <div class="library-nav-wrapper">
        <div class="library-nav-dropdown">
            <div class="library-nav-title-block">
                <h3 class="library-nav-view">Section</h3>
            </div>
            <div class="aselect" >
                <div ref="section" class="selector" @click="toggle('section')">
                    <div class="label">
                        <p v-if="libraryDisplay.viewType['shelf'] !== 'NotSelected'">
                            {{libraryDisplay.viewType['shelf']}} | 
                            {{categoryMap.get(libraryDisplay.viewType['shelf'])[libraryDisplay.view['shelf']]}} - 
                            {{ libraryDisplay.view['shelfOrderMethod']==='A'? 'A to Z': 'Low to High' }}
                        </p>
                        <p v-else="">
                            {{categoryMap.get(libraryDisplay.viewType['shelf'])[libraryDisplay.view['shelf']]}}
                        </p>
                    </div>
                    <div class="arrow" :class="{ expanded : visible }"></div>
                    <div class="categories" :class="{ hidden : !visible.section }">
                        <ul class="scrollable">
                            <li :class="{ current : `NotSelected:${item.category}` === value.section }" v-for="item in sectionCategories.NotSelected" 
                                @click="handleViewSelection('shelf', item.category, 'NotSelected')">
                                Not Selected
                            </li>
                            <li :class="{ current : `Agent:${item.category}` === value.section }" v-for="item in sectionCategories.Agent" 
                            @click="handleViewSelection('shelf', item.category, 'Agent')">
                                Agent | {{ agentCategories[item.category]}} - {{ sectionCategories.Agent[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                            <li :class="{ current : `Book:${item.category}` === value.section }" v-for="item in sectionCategories.Book" 
                            @click="handleViewSelection('shelf', item.category, 'Book')">
                                Book | {{ bookCategories[item.category]}} - {{ sectionCategories.Book[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                            <li :class="{ current : `Mark:${item.category}` === value.section }" v-for="item in sectionCategories.Mark" 
                            @click="handleViewSelection('shelf', item.category, 'Mark')">
                                Mark | {{ markCategories[item.category] }} - {{ sectionCategories.Mark[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="library-nav-dropdown">
            <div class="library-nav-title-block">
                <h3 class="library-nav-view">Sort</h3>
            </div>
            <div class="aselect" >
                <div ref="sort" class="selector" @click="toggle('sort')">
                    <div class="label">
                        <p v-if="libraryDisplay.viewType['bookend'] !== 'NotSelected'">
                            {{libraryDisplay.viewType['bookend']}} | 
                            {{categoryMap.get(libraryDisplay.viewType['bookend'])[libraryDisplay.view['bookend']]}} - 
                            {{ libraryDisplay.view['bookendOrderMethod']==='A'? 'A to Z': 'Low to High' }}
                        </p>
                        <p v-else="">
                            {{categoryMap.get(libraryDisplay.viewType['bookend'])[libraryDisplay.view['bookend']]}}
                        </p>
                    </div>
                    <div class="arrow" :class="{ expanded : visible }"></div>
                    <div class="categories" :class="{ hidden : !visible.sort }">
                        <ul class="scrollable">
                            <li :class="{ current : `NotSelected:${item.category}` === value.sort }" v-for="item in sortCategories.NotSelected" 
                                @click="handleViewSelection('bookend', item.category, 'NotSelected')">
                                Not Selected
                            </li>
                            <li :class="{ current : `Agent:${item.category}` === value.sort }" v-for="item in sortCategories.Agent" 
                            @click="handleViewSelection('bookend', item.category, 'Agent')">
                                Agent | {{ agentCategories[item.category]}} - {{ sortCategories.Agent[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                            <li :class="{ current : `Book:${item.category}` === value.sort }" v-for="item in sortCategories.Book" 
                            @click="handleViewSelection('bookend', item.category, 'Book')">
                                Book | {{ bookCategories[item.category]}} - {{ sortCategories.Book[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                            <li :class="{ current : `Mark:${item.category}` === value.sort }" v-for="item in sortCategories.Mark" 
                            @click="handleViewSelection('bookend', item.category, 'Mark')">
                                Mark | {{ markCategories[item.category] }} - {{ sortCategories.Mark[item.category]['sortMethod']==='A'? 'A to Z': 'Low to High' }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="library-nav-dropdown">
            <div class="library-nav-title-block">
                <h3 class="library-nav-view">Proportions</h3>
            </div>
            <div class="aselect" >
                <div ref="height" class="selector" @click="toggle('height')">
                    <div class="label">
                        <p v-if="libraryDisplay.viewType['height'] !== 'NotSelected'">
                            {{libraryDisplay.viewType['height']}} | 
                            {{categoryMap.get(libraryDisplay.viewType['height'])[libraryDisplay.view['height']]}}
                        </p>
                        <p v-else="">
                            {{categoryMap.get(libraryDisplay.viewType['height'])[libraryDisplay.view['height']]}}
                        </p>
                    </div>
                    <div class="arrow" :class="{ expanded : visible }"></div>
                    <div class="categories" :class="{ hidden : !visible.height }">
                        <ul class="scrollable">
                            <li :class="{ current : `NotSelected:${item.category}` === value.height }" v-for="item in heightCategories.NotSelected" 
                                @click="handleViewSelection('height', item.category, 'NotSelected')">
                                Not Selected
                            </li>
                            <li :class="{ current : `Agent:${item.category}` === value.height }" v-for="item in heightCategories.Agent" 
                            @click="handleViewSelection('height', item.category, 'Agent')">
                                Agent | {{ agentCategories[item.category]}}
                            </li>
                            <li :class="{ current : `Book:${item.category}` === value.height }" v-for="item in heightCategories.Book" 
                            @click="handleViewSelection('height', item.category, 'Book')">
                                Book | {{ bookCategories[item.category]}}
                            </li>
                            <li :class="{ current : `Mark:${item.category}` === value.height }" v-for="item in heightCategories.Mark" 
                            @click="handleViewSelection('height', item.category, 'Mark')">
                                Mark | {{ markCategories[item.category] }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <div class="library-nav-dropdown">
            <div class="library-nav-title-block">
                <h3 class="library-nav-view">Colour</h3>
            </div>
            <div class="aselect" >
                <div ref="colour" class="selector" @click="toggle('colour')">
                    <div class="label">
                        <p v-if="libraryDisplay.viewType['colour'] !== 'NotSelected'">
                            {{libraryDisplay.viewType['colour']}} | 
                            {{categoryMap.get(libraryDisplay.viewType['colour'])[libraryDisplay.view['colour']]}}
                        </p>
                        <p v-else="">
                            {{categoryMap.get(libraryDisplay.viewType['colour'])[libraryDisplay.view['colour']]}}
                        </p>
                    </div>
                    <div class="arrow" :class="{ expanded : visible }"></div>
                    <div class="categories" :class="{ hidden : !visible.colour }">
                        <ul class="scrollable">
                            <li :class="{ current : `NotSelected:${item.category}` === value.colour }" v-for="item in colourCategories.NotSelected" 
                                @click="handleViewSelection('colour', item.category, 'NotSelected')">
                                Not Selected
                            </li>
                            <li :class="{ current : `Agent:${item.category}` === value.colour }" v-for="item in colourCategories.Agent" 
                            @click="handleViewSelection('colour', item.category, 'Agent')">
                                Agent | {{ agentCategories[item.category]}}
                            </li>
                            <li :class="{ current : `Book:${item.category}` === value.colour }" v-for="item in colourCategories.Book" 
                            @click="handleViewSelection('colour', item.category, 'Book')">
                                Book | {{ bookCategories[item.category]}}
                            </li>
                            <li :class="{ current : `Mark:${item.category}` === value.colour }" v-for="item in colourCategories.Mark" 
                            @click="handleViewSelection('colour', item.category, 'Mark')">
                                Mark | {{ markCategories[item.category] }}
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="library-nav-colour-wrapper">
        <div class="library-nav-title-block">
        <h3 class="library-nav-view-colour">Colour Categories</h3>
        </div>  
        <div  v-for="item in  colourSet" :key="item">
            <div class="library-nav-colour-item">
                <div class="library-nav-colour-category" :style="{ background: itemColour(item)}"></div>
                <h2 class="library-nav-colour-label">{{item}}</h2>
            </div>
        </div>
    </div>
</div>
</template>

<script setup>
import { storeToRefs } from "pinia";

//View State
const viewStore = useViewStore();
const { libraryData,
        libraryDisplay,
        formattedLibrary, 
        itemHeight,
        itemColour, 
        colourSet,
        viewHeightBounds, 
        viewColourSet } = storeToRefs(viewStore)
        const { parseDatabase,
        handleViewSelection,
        getIDP,
        handleColour } = useViewStore();

//Reference Constants
const referenceStore = useReferenceStore();
const { categoryMap, 
        viewMap,
        invCategoryMap, 
        colourMapFiltered,
        scales } = storeToRefs(referenceStore)


        console.log('Array.from colourSet',viewStore.getColourSet)

const NotSelectedCategories = ref(referenceStore.categoryMap.get("NotSelected"))
const agentCategories = ref(referenceStore.categoryMap.get("Agent"))
const bookCategories = ref(referenceStore.categoryMap.get("Book"))
const markCategories = ref(referenceStore.categoryMap.get("Mark"))

const sectionCategories = ref({NotSelected: {}, Agent: {}, Book: {}, Mark: {}})
const sortCategories = ref({NotSelected: {}, Agent: {}, Book: {}, Mark: {}})
const heightCategories = ref({NotSelected: {}, Agent: {}, Book: {}, Mark: {}})
const colourCategories = ref({NotSelected: {}, Agent: {}, Book: {}, Mark: {}})

Object.entries(referenceStore.viewMap.get("NotSelected")).forEach(entry => {
    const [key , val] = entry
    val.useSection ? sectionCategories.value.NotSelected[key] = val : null
    val.useOrder ? sortCategories.value.NotSelected[key] = val : null
    val.useHeight ? heightCategories.value.NotSelected[key] = val : null
    val.useColour ? colourCategories.value.NotSelected[key] = val : null
});

Object.entries(referenceStore.viewMap.get("Agent")).forEach(entry => {
    const [key , val] = entry
    val.useSection ? sectionCategories.value.Agent[key] = val : null
    val.useOrder ? sortCategories.value.Agent[key] = val : null
    val.useHeight ? heightCategories.value.Agent[key] = val : null
    val.useColour ? colourCategories.value.Agent[key] = val : null
});

Object.entries(referenceStore.viewMap.get("Book")).forEach(entry => {
    const [key , val] = entry
    val.useSection ? sectionCategories.value.Book[key] = val : null
    val.useOrder ? sortCategories.value.Book[key] = val : null
    val.useHeight ? heightCategories.value.Book[key] = val : null
    val.useColour ? colourCategories.value.Book[key] = val : null
});

Object.entries(referenceStore.viewMap.get("Mark")).forEach(entry => {
    const [key , val] = entry
    val.useSection ? sectionCategories.value.Mark[key] = val : null
    val.useOrder ? sortCategories.value.Mark[key] = val : null
    val.useHeight ? heightCategories.value.Mark[key] = val : null
    val.useColour ? colourCategories.value.Mark[key] = val : null
});


    const value = computed (()=> {
        return { 
            section: `${viewStore.libraryDisplay.viewType['shelf']}:${[viewStore.libraryDisplay.view['shelf']]}`,
            sort: `${viewStore.libraryDisplay.viewType['bookend']}:${[viewStore.libraryDisplay.view['bookend']]}`,
            height: `${viewStore.libraryDisplay.viewType['height']}:${[viewStore.libraryDisplay.view['height']]}`,
            colour: `${viewStore.libraryDisplay.viewType['colour']}:${[viewStore.libraryDisplay.view['colour']]}`
    }
    })

    const visible = reactive({
        section: false,
        sort: false,
        height: false,
        colour: false,
    })

    const section = ref(false)
    const sort = ref(false)
    const height = ref(false)
    const colour = ref(false)

   const toggle = (option)=> {
       console.log(option)
       visible[option] = !visible[option]
    }

    onClickOutside(section, (event) => visible.section? visible.section = !visible.section : null)
    onClickOutside(sort, (event) => visible.sort? visible.sort = !visible.sort : null)
    onClickOutside(height, (event) => visible.height? visible.height = !visible.height : null)
    onClickOutside(colour, (event) => visible.colour? visible.colour = !visible.colour : null)

		
</script>

<style lang="scss" scoped>

.library-nav-container{
    min-width: 10rem;
    margin: 1rem var(--sideMargins) 3rem;
    display: grid;
    grid-template-rows: auto auto;

}
.library-nav-wrapper{
    grid-row: 1 / 2;
    display: flex;
    flex-flow: row wrap;
    justify-content: space-between;

}
.library-nav-colour-wrapper{
    grid-row: 2 / 3;
    display: flex;
    flex-flow: row wrap;
    justify-content: flex-start;
    gap: 2rem;
    padding: 0 0 1rem;

}

.library-nav-colour-item{
    // position: relative;
    display: flex;
    flex-direction: row;
    // align-content: center;
    align-items: baseline;
}
.library-nav-colour-category{
        align-self: center;
	// position: absolute;
	// bottom: 2px;
	// left: 2px;
	padding: 0.5rem;
    margin:  0 0.5rem; 
    // display: flex;
    // flex-wrap: nowrap;
    // flex-direction: column;
    // justify-content: flex-start;
    // align-content: center;
    // align-items: center;
	border-radius: 20rem;
}
.library-nav-colour-label{
    align-self: center;
    font-family: 'Raleway', sans-serif;
	font-size: 0.85rem;
	font-weight: 450;
    letter-spacing: 0.05rem;
    line-height: 1.25rem;
	color: black;
    width: 100%;
}
.library-nav-dropdown{
    display: flex;
    flex-flow: row wrap;
    justify-content: space-around;
    align-items: center;
}

.library-nav-title-block{
    margin: 0 1rem;
}

.library-nav-view{
    margin: 0.5rem 0 0 0;
    font-family: 'Raleway', sans-serif;
	font-size: 0.85rem;
	font-weight: 450;
    letter-spacing: 0.05rem;
    line-height: 1.25rem;
	color: black;
    width: 60%;
}

.library-nav-view-colour{
    align-self: center;
    // margin: 0.5rem 0 0 0;
    font-family: 'Raleway', sans-serif;
	font-size: 0.85rem;
	font-weight: 450;
    letter-spacing: 0.05rem;
    line-height: 1.25rem;
	color: black;
    width: 100%;
}


.aselect {
    min-width: 15rem;
    margin: 20px auto;
    padding: 0;
    z-index: 5;


		.selector {
			border: 1px solid gainsboro;
			background: #ffffff;
			position: relative;
			z-index: 5;
            width: calc(100% + 25px);
            cursor: pointer;
			.arrow {
				position: absolute;
				right: 10px;
				top: 45%;
				width: 0;
				height: 0;
				border-left: 5px solid transparent;
				border-right: 5px solid transparent;
				border-bottom: 8px solid #adadad;
				// transform: rotate(90deg);
				// transition-duration: 0.3s;
				// transition-timing-function: cubic-bezier(.59,1.39,.37,1.01);
			}

			.expanded {
				transform: rotateZ(180deg) translateY(2px);
			}
			.label {
				display: block;
				padding: 0.5rem 0.5rem 0.4rem;
                // margin: 0.5rem 0 0 0;
                font-family: 'Raleway', sans-serif;
                font-size: 0.8rem;
                font-weight: 500;
                letter-spacing: 0.05rem;
                line-height: 1.25rem;
                color: black;
				// color: #888;
			}
		}

        .selector:hover {
            background:#f7e8f777;
        }

		ul {
			width: 100%;
			list-style-type: none;
            padding: 0;
            margin: 0;
            font-family: 'Raleway', sans-serif;
            font-size: 0.75rem;
            font-weight: 450;
            letter-spacing: 0.05rem;
            line-height: 1.25rem;
            color: black;
			border: 1px solid gainsboro;
			position: absolute;
            // top: 0;
            background: #fff;
            // display: block;
            max-height: 60vh;
            overflow: auto;
		}
		li {
			padding: 12px;
			color: #666;
            border-bottom: 1px solid gainsboro;
            cursor: pointer;
			&:hover {
				// color: white;
				background:#f7e8f777;
			}
		}
		.current {
			font-size: 0.8rem;
            font-weight: 500;
            color:  black;
            background: #f7e8f777;
		}
		.hidden {
			visibility: hidden;
		}
		.visible {
			visibility: visible;
		}
	}

</style>