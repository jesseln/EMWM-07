import { storeToRefs } from "pinia";

export const useReferenceStore = defineStore('reference', ()=>{
    const { invertObject } = useUtils();
    //Your Shelf State
    const yourShelfStore = useYourShelfStore();
    const { yourShelf }  = storeToRefs(yourShelfStore)
    const { addToShelf, 
            removeFromShelf } = useYourShelfStore();

    ///////////////////////
    // LABEL CONVERSIONS //
    ///////////////////////
    const categoryMap = reactive(new Map());
    categoryMap
    .set('Book', {
            ['BookID']: 'ID',
            ['Repository']: 'Repository', 
            ['Date of publication']: 'Year Published', 
            ['Genre/Identity']: 'Book Genre',
            ['Title']: 'Book Title',
            ['Author']: 'Author',
            ['Place of publication']: 'Place of publication',
            ['Size']: 'Book Size',
            ['Book Notes']:'Book Notes',
            ['Print or manuscript']: 'Format',
            ['STC or Wing']: 'STC or Wing',
            ['Shelfmark']: 'Shelfmark',
            ['Marginal Marks']: 'Marginal marks',
            ['Book image/s']: 'Images',
            ['Number of marks']: 'Number of marks in book',
            ['Number of book images']: 'Number of book images',
    })
    categoryMap
    .set('Agent', {
            ['FemaleAgentID']: 'ID',
            ['Female agent name']: 'Agent name', 
            ['Female agent date']: 'Agent date', 
            ['Female agent bio']: 'Agent bio',
            ['Number of marks']: 'Number of marks by agent',
    })
    categoryMap
    .set('Mark', {
            ['MargID']: 'ID',
            ['Notes']: 'Notes',
            ['Ownership type']: 'Ownership type',
            ['Distribution']: 'Distribution of marks',
            ['Female agent status']: 'Confidence in female authorship',
            ['Annotation type']: 'Annotation type',
            ['Location sig. ; p. ; pp.']: 'Location',
            ['Recording type']: 'Recording type',
            ['Transcription']: 'Transcription',
            ['Mark type (Mark of?)']: 'Type of mark',
            ['Images of marginal mark']: 'Images',
            ['Class']: 'Class',
            ['Position on page']: 'Position on page',
            ['Location other']: 'Location detail',
            ['Added text type']: 'Type of added text',
            ['Drawing type']: 'Type of drawing',
            ['Graffiti type']: 'Type of Graffiti',
            ['Agent role']: 'Agent role',
            ['Other notes']: 'Other notes',
    })

    //Inverse Map - Created to reverse conversion as needed in one place only
    const invCategoryMap = reactive(new Map());
    invCategoryMap
    .set('Book', invertObject(categoryMap.get('Book')))
    invCategoryMap
    .set('Agent', invertObject(categoryMap.get('Agent')))
    invCategoryMap
    .set('Mark', invertObject(categoryMap.get('Mark')))

    ////////////
    // SCALES //
    ////////////
    const heightScale = 1.5;
    const widthScale = 2;

    const scales = reactive({
        maxItemHeight: 100 * heightScale,
        maxShelfHeight: 110 * heightScale,
        minItemHeight: 35 * heightScale,
        minItemWidth: 16 * widthScale     
    })

    const colourMap = reactive(new Map());
    colourMap
    .set('Book', {
            ['BookID']: {func: 'scaleSequential', scheme: 'interpolateYlGnBu', useLen: false,  useColumn: true},
            ['Repository']: {useColumn: false}, 
            ['Date of publication']: {func: 'scaleSequential', scheme: 'interpolateRdYlBu', useLen: false,  useColumn: true},
            ['Genre/Identity']: {func: 'scaleOrdinal', scheme: 'schemeSet3', useLen: false, useColumn: true},
            ['Title']: {useColumn: false},
            ['Author']: {useColumn: false},
            ['Place of publication']: {func: 'scaleOrdinal', scheme: 'schemePaired', useLen: false, useColumn: true},
            ['Size']: {func: 'scaleOrdinal', scheme: 'schemePaired', useLen: false, useColumn: true},
            ['Book Notes']: {useColumn: false},
            ['Print or manuscript']: {func: 'scaleOrdinal', scheme: 'schemeDark2', useLen: false,  useColumn: true},
            ['STC or Wing']: {func: 'scaleOrdinal', scheme: 'schemeDark2', useLen: false},
            ['Shelfmark']: {useColumn: false},
            ['Marginal Marks']: {useColumn: false},
            ['Book image/s']: {useColumn: false},
            ['Number of marks']:  {func: 'scaleSequential', scheme: 'interpolatePlasma', useLen: true,  useColumn: true},
            ['Number of book images']: {func: 'scaleSequential', scheme: 'interpolateCool', useLen: true,  useColumn: true},
    })
    colourMap
    .set('Agent', {
            ['FemaleAgentID']: {func: 'scaleSequential', scheme: 'interpolatePuRd', useLen: false,  useColumn: true},
            ['Female agent name']: {useColumn: false}, 
            ['Female agent date']: {func: 'scaleSequential', scheme: 'interpolateSpectral', useLen: false,  useColumn: true},
            ['Female agent bio']: {useColumn: false},
            ['Number of marks']: {func: 'scaleSequential', scheme: 'interpolateBuPu', useLen: true,  useColumn: true},
    })
    colourMap
    .set('Mark', {
            ['MargID']: {func: 'scaleSequential', scheme: 'interpolateRdPu', useLen: false,  useColumn: true},
            ['Notes']: {useColumn: false},
            ['Ownership type']: {func: 'scaleOrdinal', scheme: 'schemeSet1', useLen: false,  useColumn: true},
            ['Distribution']: {func: 'scaleOrdinal', scheme: 'schemePastel1', useLen: false,  useColumn: true},
            ['Female agent status']: {func: 'scaleOrdinal', scheme: 'schemeSet1', useLen: false,  useColumn: true},
            ['Annotation type']: {func: 'scaleOrdinal', scheme: 'schemeSet2', useLen: false,  useColumn: true},
            ['Location sig. ; p. ; pp.']: {useColumn: false},
            ['Recording type']: {func: 'scaleOrdinal', scheme: 'schemeSet2', useLen: false,  useColumn: true},
            ['Transcription']: {useColumn: false},
            ['Mark type (Mark of?)']: {func: 'scaleOrdinal', scheme: 'schemeTableau10', useLen: false, useColumn: true},
            ['Images of marginal mark']: {useColumn: false},
            ['Class']: {func: 'scaleOrdinal', scheme: 'schemeAccent', useLen: false, useColumn: true},
            ['Position on page']: {func: 'scaleOrdinal', scheme: 'schemeSet3', useLen: false, useColumn: true},
            ['Location other']: {func: 'scaleOrdinal', scheme: 'schemeSet3', useLen: false, useColumn: true},
            ['Added text type']: {func: 'scaleOrdinal', scheme: 'schemeAccent', useLen: false, useColumn: true},
            ['Drawing type']: {func: 'scaleOrdinal', scheme: 'schemeDark2', useLen: false,  useColumn: true},
            ['Graffiti type']: {func: 'scaleOrdinal', scheme: 'schemeDark2', useLen: false,  useColumn: true},
            ['Agent role']: {func: 'scaleOrdinal', scheme: 'schemeAccent', useLen: false, useColumn: true},
            ['Other notes']: {useColumn: false},
    })

    const colourMapFiltered = reactive(new Map());
    const colourMapTemp = new Map(categoryMap)

    const bookColour = colourMap.get('Book')
    const agentColour = colourMap.get('Agent')
    const markColour = colourMap.get('Mark')

    const bookFilter = JSON.parse(JSON.stringify(colourMapTemp.get('Book')))
    const agentFilter = JSON.parse(JSON.stringify(colourMapTemp.get('Agent')))
    const markFilter = JSON.parse(JSON.stringify(colourMapTemp.get('Mark')))

        Object.keys(bookFilter)
        .forEach(key => { if (!bookColour[key].useColumn) delete bookFilter[key] })
        Object.keys(agentFilter)
        .forEach(key => { if (!agentColour[key].useColumn) delete agentFilter[key] })
        Object.keys(markFilter)
        .forEach(key => { if (!markColour[key].useColumn) delete markFilter[key] })


    colourMapFiltered.set('Book', bookFilter)
    colourMapFiltered.set('Agent', agentFilter)
    colourMapFiltered.set('Mark', markFilter)
    
    //View Query Configurations //
    // How many agents are in the collection? 
    const agentsInCollection = ({
        view: {
            itemType: "Agent",
            id: 'FemaleAgentID',
            shelf: 'null', //Primary sort
            useShelf: false,
            showShelf: false,
            bookend: 'null', //Secondary sort
            useBookend: false,
            showBookend: false,
            height: 'Number of marks',
            useHeight: true,
            colour: 'Female agent status',
            useColour: true,
        },
        viewType: {
            id: 'Agent',
            shelf: 'Agent',
            bookend: 'Agent',
            height: 'Agent',
            colour: 'Mark',
        }
    })



    //Objects passed to Components 
    const libraryItemBundle = computed (() => {
        return {
            agents: {
                labelViewMode: 'agentLabel',
                menuHeader: 'Agent',
                menuSubheader: 'Female agent name',
                ownProp1: 'Female agent date',
                ownProp2: 'Female agent bio',
                ownProp3: 'Number of marks',
                collectionProp1: 'agentCollectionProp1',
                collectionProp2:'agentCollectionProp2',
                viewProp1: 'height',
                viewProp2: 'colour',
                viewProp3: 'shelf',
                viewProp4: 'bookend',
                itemType: 'Agent',
                yourShelfFunction(item) { return addToShelf(item)}, //Method property shorthand
                yourShelfText: 'Add to Collection',
            },
            books: {
                labelViewMode: 'bookLabel',
                menuHeader: 'Book',
                menuSubheader: 'Shelfmark',
                ownProp1: 'Title',
                ownProp2: 'Author',
                ownProp3: 'Date of publication',
                collectionProp1: 'bookCollectionProp1',
                collectionProp2:'bookCollectionProp2',
                viewProp1: 'height',
                viewProp2: 'colour',
                viewProp3: 'shelf',
                viewProp4: 'bookend',
                itemType: 'Book',
                yourShelfFunction(item) { return addToShelf(item)}, //Method property shorthand
                yourShelfText: 'Add to Collection',
            },
            marks: {
                labelViewMode: 'markLabel',
                menuHeader: 'Mark',
                menuSubheader: 'Transcription',
                ownProp1: 'Mark type (Mark of?)',
                ownProp2: 'Distribution',
                ownProp3: 'Female agent status',
                collectionProp1: 'markCollectionProp1',
                collectionProp2:'markCollectionProp2',
                viewProp1: 'height',
                viewProp2: 'colour',
                viewProp3: 'shelf',
                viewProp4: 'bookend',
                itemType: 'Mark',
                yourShelfFunction(item) { return addToShelf(item)}, //Method property shorthand
                yourShelfText: 'Add to Collection',
            }
        }
    })


    let colourBundle = JSON.parse(JSON.stringify(libraryItemBundle.value))
    Object.keys(colourBundle).forEach((key) =>{
        colourBundle[key].labelViewMode = 'colour';
        colourBundle[key].yourShelfFunction = addToShelf; //Re-assignment required after object is stringified.
    })

    //Bundle Object passed to Components
    const viewColourItemBundle = computed (() => {
        return colourBundle;
    })

    const viewEditItemBundle = computed (() => {
        return libraryItemBundle.value
    })


    
    let shelfBundle = JSON.parse(JSON.stringify(libraryItemBundle.value))
    Object.keys(shelfBundle).forEach((key) =>{
        shelfBundle[key].yourShelfFunction = removeFromShelf; //Method assignment expression
        shelfBundle[key].yourShelfText = 'Remove from Collection';
    })
    
    //Bundle Object passed to Components
    const yourShelfItemBundle = computed (() => {
        return shelfBundle;
    })



    console.log(yourShelfItemBundle)
    // console.log(categoryMap)
    // console.log(colourMap)
      return {  categoryMap, 
                invCategoryMap, 
                colourMap, 
                colourMapFiltered, 
                scales, 
                libraryItemBundle, 
                yourShelfItemBundle,
                viewEditItemBundle,
                viewColourItemBundle}
  })


// Template

//   colourMap
//   .set('Book', {
//           ['BookID']: '',
//           ['Repository']: '', 
//           ['Date of publication']: '', 
//           ['Genre/Identity']: '',
//           ['Title']: '',
//           ['Author']: '',
//           ['Place of publication']: '',
//           ['Size']: 'schemePaired',
//           ['Book Notes']:'',
//           ['Print or manuscript']: '',
//           ['STC or Wing']: '',
//           ['Shelfmark']: '',
//           ['Marginal Marks']: '',
//           ['Book image/s']: '',
//           ['Number of marks']: '',
//           ['Number of book images']: '',
//   })
//   colourMap
//   .set('Agent', {
//           ['FemaleAgentID']: '',
//           ['Female agent name']: '', 
//           ['Female agent date']: '', 
//           ['Female agent bio']: '',
//           ['Number of marks']: '',
//   })
//   colourMap
//   .set('Mark', {
//           ['MargID']: '',
//           ['Notes']: '',
//           ['Ownership type']: '',
//           ['Distribution']: '',
//           ['Female agent status']: '',
//           ['Annotation type']: '',
//           ['Location sig. ; p. ; pp.']: '',
//           ['Recording type']: '',
//           ['Transcription']: '',
//           ['Mark type (Mark of?)']: '',
//           ['Images of marginal mark']: '',
//           ['Class']: 'Class',
//           ['Position on page']: '',
//           ['Location other']: '',
//           ['Added text type']: '',
//           ['Drawing type']: '',
//           ['Graffiti type']: '',
//           ['Agent role']: '',
//           ['Other notes']: '',
//   })