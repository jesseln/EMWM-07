import * as d3 from "d3";

export const useViewStore = defineStore('view', ()=>{
    const { viewMap, colourMapFiltered, scales } = useReferenceStore();
    const { handleNumeric,
            handleObjectPath,
            handleValue,
            handleArray,
            handleColourValue,
            isNumber,
            isString,
            isArray,
            containsNumber,
            processDomain } = useUtils();

    // LIBRARY STATE OBJECT//
    const libraryData = ref({})

    const heightCategory = {
        logarithmic: ['Number of marks', 'Number of book images', 'Size'],
        year: ['Date of publication', 'Female agent date']

    }

    // LIBRARY VIEW OBJECT//
    const libraryDisplay = reactive({
        //sub items in view and viewType are called the 'viewMode'.
        view: {
            itemType: "Book",
            id: 'BookID',
            shelf: 'Repository', //Primary sort
            bookend: 'Date of publication', //Secondary sort
            shelfOrderMethod: 'A', //Primary sort
            bookendOrderMethod: 'A', //Secondary sort
            height: 'Date of publication',
            colour: 'Genre/Identity',
            label: 'Title',
            agentLabel: 'Female agent name',
            bookLabel: 'Title',
            markLabel: 'Transcription',
            agentCollectionProp1: 'Mark type (Mark of?)',
            agentCollectionProp2: 'Genre/Identity',
            bookCollectionProp1: 'Female agent name',
            bookCollectionProp2: 'Number of marks',
            markCollectionProp1: 'Female agent name',
            markCollectionProp2: 'Title',
        },
        viewType: {
            id: 'Book',
            shelf: 'Book',
            bookend: 'Book',
            height: 'Book',
            colour: 'Book',
            label: 'Book',
            agentLabel: 'Agent',
            bookLabel: 'Book',
            markLabel: 'Mark',
            agentCollectionProp1: 'Mark',
            agentCollectionProp2: 'Book',
            bookCollectionProp1: 'Agent',
            bookCollectionProp2: 'Book',
            markCollectionProp1: 'Agent',
            markCollectionProp2: 'Book',
        },
        pageText: {
            queryType: 'Agents ',
            queryBreadcrumb: '/ How many agents are in the collection ?',
            libraryTypeTitle: 'The Agents',
            libraryTypeSubtitle: 'of the libraries',
        }
    })

    // LIBRARY DATA //
    const formattedLibrary = ref([])
    const itemHeight = ref()
    const itemColour = ref()
    const colourSet = ref()

    

    watch([libraryData, libraryDisplay],() => {
        if(libraryData.value.length !== undefined){
        formattedLibrary.value =  formatLibrary(libraryData.value); //Reactive when not testing
        //Item Height - Returns d3 Scale Function
        itemHeight.value = formatHeight(libraryData.value);
        //Item Colour - Returns d3 Scale Function
        itemColour.value = formatColour();
        //Colour Categories
        colourSet.value = getColourSet.value //Included here to prevent computed from firing before library.data is returned
        }
    })


    // INTERNAL GETTERS //
    //Get item height bounds
    const getDomainIndex = computed (() => {
        return {min: d3.minIndex(libraryData.value, d => getIDP(d, 'height')), 
                max: d3.maxIndex(libraryData.value, d => getIDP(d, 'height'))}
    })

    //Get unique values in colour set
    const getColourSet = computed (() => {
        return processColourSet(libraryData.value)
    })
    
    // EXTERNAL GETTERS //
    //Library Structure

    // CREATE VIEW EDITOR //
    const viewHeightBounds = computed (() => {
        return [libraryData.value[getDomainIndex.value.min],
                libraryData.value[getDomainIndex.value.max]]
    })
    //Currently applies to Arrays only
    const viewColourSet = computed (() => {
        return processColourItems(libraryData.value, getColourSet.value)
    })


    // INTERNAL FUNCTIONS //
    // FORMAT LIBRARY //
    //Set Shelves
    function formatShelf(data, viewMode){
        return d3.flatGroup(d3.sort(data, d=> getIDP(d, viewMode)), d => getIDP(d, viewMode)); 
    }
    function formatNullShelf(data, viewMode){
        return d3.flatGroup(d3.sort(data, d=> getIDP(d, viewMode)), d => 'All Items'); 
    }
    //Set Bookends
    function formatBookend(data, viewMode){
        return data
        .map(d => [d[0],d3.flatGroup(d3.sort(d[1], d=> getIDP(d, viewMode)), d=> getIDP(d, viewMode))]);  
    }
    function formatNullBookend(data, viewMode){
        return data
        .map(d => [d[0],d3.flatGroup(d3.sort(d[1], d=> getIDP(d, viewMode)), d=> 'All Items')]);  
    }
    //Combine Shelves & Bookend
    function formatLibrary(data) {
        //Shelves - Sort & Group Items by Shelf Category
        const shelfFormatData = libraryDisplay.view.shelf !== "Not Selected"
        ? formatShelf(data, 'shelf') 
        : formatNullShelf(data, 'id'); //Default
        //Bookends - Further Sort & Group Items by Bookend Category
        const shelfBookendFormatData = libraryDisplay.view.bookend !== "Not Selected"
        ? formatBookend(shelfFormatData, 'bookend') 
        : formatNullBookend(shelfFormatData, 'id'); //Default
        return shelfBookendFormatData
    }

    // HANDLE HEIGHT //
    function formatHeight(data) {
        const viewSelection = libraryDisplay.view.height
        if(viewSelection !== "Not Selected") {
            //Returns a function which takes the log scale of the input then invokes the d3 scale function (IIFE)
            if(heightCategory.logarithmic.includes(viewSelection)){
                return (value)=>{ 
                    return (d3.scaleLinear()
                                .domain(chooseHeightDomain(data).map(d => Math.log(d))) 
                                .unknown(scales.maxItemHeight) //Set all non-numeric values to max height
                                .range([scales.minItemHeight, scales.maxItemHeight])
                                .clamp(true)
                            )(Math.log(value)); 
                }
            }else{
                return d3.scaleLinear()
                            .domain(chooseHeightDomain(data)) 
                            .unknown(scales.maxItemHeight) //Set all non-numeric values to max height
                            .range([scales.minItemHeight, scales.maxItemHeight])
                            .clamp(true);     
            }
        }else{
            return (_)=> {return scales.maxItemHeight}
        }
    }
    
    function chooseHeightDomain(data){   
            const viewSelection = libraryDisplay.view.height
            const domainIndex = getDomainIndex.value
            if(heightCategory.year.includes(viewSelection)) {
                return [1450, 1750] //was - clamp(1450, longestNumber, 1750)
            }else{
                return [getIDP(data[domainIndex.min], 'height'), getIDP(data[domainIndex.max], 'height')]
            }
    }

    // HANDLE COLOUR //
    function formatColour(){
        if(libraryDisplay.view.colour !== "Not Selected"){
            const viewMode = 'colour'
            const viewSelection = libraryDisplay.view[viewMode]
            const viewModeType = libraryDisplay.viewType[viewMode]
            const colourFunction = viewMap.get(viewModeType)[viewSelection].func
            const colourScheme = viewMap.get(viewModeType)[viewSelection].scheme
            const colourScale = colourBandscale(getColourSet.value)
            const colourFunc = d3[colourFunction](d3[colourScheme]) //Applies colour functions and schemes from Object. Domain defaults to [0,1]
            return (
                    (value) => colourFunc(colourScale(value)) //Returns nested scale function after applying band function (IIFE)
                )   
        }else{
            return (_)=> {return '#fff281'}
        }    
    }

    function colourBandscale(colourSet){
        // console.log('Array.from colourSet',Array.from(colourSet))
        return d3.scaleBand()
                    .domain(Array.from(colourSet)) //Range defaults to [0,1]
    }

    function processColourSet(data){
       return new Set(data.flatMap(d=> getIDP(d, 'colour')).sort(alphabetically(true)))
    }

    function processColourItems(data, colourSet){
        let tempColourSet = colourSet;
        const uniqueColours = data.filter((d) => {
            const value = getIDP(d, 'colour')
            if(tempColourSet.has(value)){
                return tempColourSet.delete(value) //Returns true if deletion successful
            }else{
                return false
            }
        })
        return  new Set(uniqueColours.sort((a, b) => alphabetically(true)(getIDP(a, 'colour'), getIDP(b, 'colour'))))
    }

    // EXTERNAL FUNCTIONS //
    //Parse Data Object from Supabase
    async function parseDatabase(tableData) {
            libraryData.value = await JSON.parse(JSON.stringify(tableData))
            // unformattedData.value =  await JSON.parse(JSON.stringify(libraryData.value))
            // formattedLibrary.value =  formatLibrary(libraryData.value, libraryDisplay);
    }

    const dataSize = computed(() =>{
        return  libraryData.value.length?   libraryData.value.length: 0
    })


    //Update View Object from user input
    function handleViewSelection(viewMode, viewSelection, itemType){
        console.log('handleViewSelection', viewMode, viewSelection, itemType)

        if(itemType === 'NotSelected') {
            libraryDisplay.view[viewMode] = 'Not Selected'
            libraryDisplay.viewType[viewMode] = 'NotSelected'
        }else{
            if(viewMode === 'shelf'){
                libraryDisplay.view.shelfOrderMethod =  viewMap.get(itemType)[viewSelection].sortMethod
            }
            if(viewMode === 'bookend'){
                libraryDisplay.view.bookendOrderMethod =  viewMap.get(itemType)[viewSelection].sortMethod
            }
            libraryDisplay.view[viewMode] = viewSelection; //Future addition - updateView below (in database)
            libraryDisplay.viewType[viewMode] = itemType; //Future addition - updateViewType below (in database)
        }
    }

    //Dynamic Path
    //Returns the path from the itemType (via the ID name) to the itemType of the viewMode (via viewType LookUp)
    //getIDP - getItemDisplayPath - Condensed for frequent use.
    function getIDP(item, viewMode) {
        let value;
        if(!item) return null
        if(viewMode === 'Not Selected') return 'Not Selected'
        const viewSelection = libraryDisplay.view[viewMode]
        const viewModeType = libraryDisplay.viewType[viewMode]
        const itemType = itemTypeCheck(item)

        if(itemType === 'Agent'){
            //Agent Item paths
            if(viewModeType === 'Agent') value = handleObjectPath(item, viewMode, viewSelection)
            if(viewModeType === 'Mark') value = handleObjectPath(item, viewMode, 'Marks', 0, viewSelection)
            if(viewModeType === 'Book') value = handleObjectPath(item, viewMode, 'Marks', 0, 'Books', viewSelection)
        }else if(itemType === 'Book'){
            //Book Item paths                 
            if(viewModeType === 'Book') value = handleObjectPath(item, viewMode, viewSelection)
            if(viewModeType === 'Mark') value = handleObjectPath(item, viewMode,'Marks',0,viewSelection)
            if(viewModeType === 'Agent') value = handleObjectPath(item, viewMode, 'Marks', 0, 'Agents', viewSelection)
        }else if(itemType === 'Mark'){
            //Mark Item paths
            if(viewModeType === 'Mark') value = handleObjectPath(item, viewMode, viewSelection)
            if(viewModeType === 'Agent') value = handleObjectPath(item, viewMode, 'Agents', viewSelection) 
            if(viewModeType === 'Book') value = handleObjectPath(item, viewMode, 'Books', viewSelection)
        }
            return value ? value : "no data"
    }

    function itemTypeCheck(item){
        return  item['FemaleAgentID'] ? 'Agent' :
                item['BookID'] ? 'Book' :
                item['MargID'] ? 'Mark' : ''
    }

    function alphabetically(ascending) {
        return function (a, b) {
          // equal items sort equally
          if (a === b) {
              return 0;
          }
      
          // nulls sort after anything else
          if (a === 'no data') {
              return 1;
          }
          if (b === 'no data') {
              return -1;
          }
      
          // otherwise, if we're ascending, lowest sorts first
          if (ascending) {
              return a < b ? -1 : 1;
          }
      
          // if descending, highest sorts first
          return a < b ? 1 : -1;
        };
      }


      return {  libraryData,
                dataSize,
                libraryDisplay,
                formattedLibrary, 
                heightCategory,
                itemHeight,
                itemColour,
                colourSet, 
                viewHeightBounds, 
                viewColourSet,
                parseDatabase,
                handleViewSelection,
                getIDP,
                itemTypeCheck  }
  })


