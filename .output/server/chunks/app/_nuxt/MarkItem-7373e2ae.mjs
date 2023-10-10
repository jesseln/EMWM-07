import { ref, reactive, computed, watch, useSSRContext, resolveComponent, withCtx, unref, createVNode, toDisplayString, mergeProps, toHandlers } from 'vue';
import { ssrRenderComponent, ssrInterpolate, ssrRenderStyle, ssrRenderClass } from 'vue/server-renderer';
import * as d3 from 'd3';
import { d as defineStore, s as storeToRefs } from '../server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-f8b29b79.mjs';
import { isNaN } from 'lodash-es';
import { TRUE } from 'sass';

const useUtils = () => {
  function handleNumeric(value) {
    const longestNumber = coerceNumber(longestNumberString(value));
    return longestNumber;
  }
  function longestNumberString(value) {
    if (isString(value)) {
      let longest = "";
      let i = 0;
      while (i < value.length) {
        while (i < value.length && !isNumber(value[i])) {
          ++i;
        }
        let start = i;
        while (i < value.length && isNumber(value[i])) {
          ++i;
        }
        if (i - start > longest.length) {
          longest = value.slice(start, i);
        }
      }
      return longest;
    } else if (isNumber(value)) {
      return value;
    } else {
      return value;
    }
  }
  function handleObjectPath(item, viewMode, ...path) {
    if (!item)
      return false;
    let obj = item;
    for (let i = 0; i < path.length; i++) {
      let prop = path[i];
      if (!obj || !obj.hasOwnProperty(prop)) {
        return false;
      } else {
        obj = obj[prop];
      }
    }
    if (viewMode === "colour") {
      return handleColourValue(obj);
    } else if (viewMode === "height") {
      return handleValue(obj);
    } else {
      return handleValue(obj);
    }
  }
  function handleObjectProperty(obj, prop) {
    let value;
    if (!obj || !obj.hasOwnProperty(prop)) {
      return "no data";
    } else {
      value = handleValue(obj[prop]);
    }
    return value ? value : "no data";
  }
  function handleValue(value) {
    if (!value || value.length === 0)
      return false;
    if (isNumber(value)) {
      return handleNumeric(value);
    } else if (isString(value)) {
      return value;
    } else if (isArray(value)) {
      return handleArray(value);
    }
  }
  function handleArray(value) {
    if (!value || value.length === 0)
      return false;
    if (value.length === 1) {
      return value[0];
    } else {
      value.sort();
      return value.slice(0, -1).join(", ") + " & " + value.slice(-1);
    }
  }
  function handleColourValue(value) {
    if (!value || value.length === 0)
      return false;
    if (isNumber(value)) {
      return value;
    } else if (isString(value)) {
      return value;
    } else if (isArray(value)) {
      return value[0];
    }
  }
  const contrastHandler = function(inputColour) {
    if (!inputColour)
      return "#303030";
    let backgroundColour = inputColour;
    if (backgroundColour.includes("rgb")) {
      backgroundColour = d3.color(inputColour).formatHex();
    }
    let hex = backgroundColour.charAt(0) === "#" ? backgroundColour.substring(1, 7) : backgroundColour;
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error("Invalid HEX color.");
    }
    let r = parseInt(hex.slice(0, 2), 16), g = parseInt(hex.slice(2, 4), 16), b = parseInt(hex.slice(4, 6), 16);
    return r * 0.299 + g * 0.587 + b * 0.114 > 150 ? "#303030" : "#ffffff";
  };
  const clamp = (min, value, max) => value ? Math.min(Math.max(value, min), max) : value;
  const coerceNumber = (value) => isNumber(value) ? Number(value) : value;
  const isNumber = (value) => !isNaN(value) && !isNaN(parseFloat(value));
  const isString = (value) => typeof value === "string";
  const isArray = (value) => Array.isArray(value);
  function isStringOrArray(value) {
    if (isArray(value))
      return "array";
    if (isString(value))
      return "string";
    return null;
  }
  function containsStringOrArray(data, viewSelection) {
    const typeFound = data.find((d) => isArray(d[viewSelection]) || isString(d[viewSelection]));
    return isStringOrArray(typeFound[viewSelection]);
  }
  const containsNumber = (data, viewSelection) => data.some((d) => isNumber(d[viewSelection]));
  const containsString = (data, viewSelection) => data.some((d) => typeof d[viewSelection] === "string");
  const containsArray = (data, viewSelection) => data.some((d) => Array.isArray(d[viewSelection]));
  const minItemIndex = (data, viewSelection) => d3.minIndex(data, (d) => handleNumeric(d[viewSelection]));
  const maxItemIndex = (data, viewSelection) => d3.maxIndex(data, (d) => handleNumeric(d[viewSelection]));
  function processDomain(data, viewSelection) {
    const domainIndex = { min: minItemIndex(data, viewSelection), max: maxItemIndex(data, viewSelection) };
    return domainIndex;
  }
  function invertObject(obj) {
    return Object.keys(obj).reduce((ret, key) => {
      ret[obj[key]] = key;
      return ret;
    }, {});
  }
  return {
    handleNumeric,
    clamp,
    longestNumberString,
    handleObjectPath,
    handleObjectProperty,
    handleValue,
    handleArray,
    handleColourValue,
    contrastHandler,
    coerceNumber,
    isNumber,
    isString,
    isArray,
    isStringOrArray,
    containsStringOrArray,
    containsNumber,
    containsString,
    containsArray,
    minItemIndex,
    maxItemIndex,
    processDomain,
    invertObject
  };
};
const useYourShelfStore = defineStore("yourShelf", () => {
  const yourShelf = ref([]);
  async function addToShelf(item) {
    let id;
    if (item["FemaleAgentID"])
      id = "FemaleAgentID";
    if (item["BookID"])
      id = "BookID";
    if (item["MargID"])
      id = "MargID";
    const exists = yourShelf.value.find((i) => i[id] === item[id]);
    if (exists) {
      alert("Item already on shelf");
    }
    if (!exists) {
      yourShelf.value.push({ ...item });
    }
  }
  async function removeFromShelf(item) {
    let id;
    if (item["FemaleAgentID"])
      id = "FemaleAgentID";
    if (item["BookID"])
      id = "BookID";
    if (item["MargID"])
      id = "MargID";
    yourShelf.value = yourShelf.value.filter((d) => d[id] !== item[id]);
  }
  return { yourShelf, addToShelf, removeFromShelf };
});
const useReferenceStore = defineStore("reference", () => {
  const { invertObject } = useUtils();
  const yourShelfStore = useYourShelfStore();
  storeToRefs(yourShelfStore);
  const {
    addToShelf,
    removeFromShelf
  } = useYourShelfStore();
  const categoryMap = reactive(/* @__PURE__ */ new Map());
  categoryMap.set("NotSelected", {
    ["Not Selected"]: "Not Selected"
  });
  categoryMap.set("Book", {
    ["BookID"]: "ID",
    ["Repository"]: "Repository",
    ["Date of publication"]: "Year Published",
    ["Genre/Identity"]: "Book Genre",
    ["Title"]: "Book Title",
    ["Author"]: "Author",
    ["Place of publication"]: "Place of publication",
    ["Size"]: "Book Size",
    ["Book Notes"]: "Book Notes",
    ["Print or manuscript"]: "Format",
    ["STC or Wing"]: "STC or Wing",
    ["Shelfmark"]: "Shelfmark",
    ["Marginal Marks"]: "Marginal marks",
    ["Book image/s"]: "Images",
    ["Number of marks"]: "Number of marks in book",
    ["Number of book images"]: "Number of book images"
  });
  categoryMap.set("Agent", {
    ["FemaleAgentID"]: "ID",
    ["Female agent name"]: "Agent name",
    ["Female agent date"]: "Agent date",
    ["Female agent bio"]: "Agent bio",
    ["Number of marks"]: "Number of marks by agent"
  });
  categoryMap.set("Mark", {
    ["MargID"]: "ID",
    ["Notes"]: "Notes",
    ["Ownership type"]: "Ownership type",
    ["Distribution"]: "Distribution of marks",
    ["Female agent status"]: "Confidence in female authorship",
    ["Annotation type"]: "Annotation type",
    ["Location sig. ; p. ; pp."]: "Location",
    ["Recording type"]: "Recording type",
    ["Transcription"]: "Transcription",
    ["Mark type (Mark of?)"]: "Type of mark",
    ["Images of marginal mark"]: "Images",
    ["Class"]: "Class",
    ["Position on page"]: "Position on page",
    ["Location other"]: "Location detail",
    ["Added text type"]: "Type of added text",
    ["Drawing type"]: "Type of drawing",
    ["Graffiti type"]: "Type of Graffiti",
    ["Agent role"]: "Agent role",
    ["Other notes"]: "Other notes"
  });
  const invCategoryMap = reactive(/* @__PURE__ */ new Map());
  invCategoryMap.set("NotSelected", invertObject(categoryMap.get("NotSelected")));
  invCategoryMap.set("Book", invertObject(categoryMap.get("Book")));
  invCategoryMap.set("Agent", invertObject(categoryMap.get("Agent")));
  invCategoryMap.set("Mark", invertObject(categoryMap.get("Mark")));
  const heightScale = 1.5;
  const widthScale = 2;
  const scales = reactive({
    maxItemHeight: 100 * heightScale,
    maxShelfHeight: 110 * heightScale,
    minItemHeight: 35 * heightScale,
    minItemWidth: 16 * widthScale
  });
  const viewMap = reactive(/* @__PURE__ */ new Map());
  viewMap.set("NotSelected", {
    ["Not Selected"]: { category: "Not Selected", useColour: true, useSection: true, useOrder: true, useHeight: true }
  });
  viewMap.set("Book", {
    ["BookID"]: { sortMethod: "1", category: "BookID", func: "scaleSequential", scheme: "interpolateYlGnBu", useColour: true, useSection: false, useOrder: true, useHeight: false },
    ["Repository"]: { sortMethod: "A", category: "Repository", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Date of publication"]: { sortMethod: "1", category: "Date of publication", func: "scaleSequential", scheme: "interpolateRdYlBu", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Genre/Identity"]: { sortMethod: "A", category: "Genre/Identity", func: "scaleOrdinal", scheme: "schemeSet3", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Title"]: { sortMethod: "A", category: "Title", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Author"]: { sortMethod: "A", category: "Author", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Place of publication"]: { sortMethod: "A", category: "Place of publication", func: "scaleOrdinal", scheme: "schemePaired", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Size"]: { sortMethod: "1", category: "Size", func: "scaleOrdinal", scheme: "schemePaired", useColour: true, useSection: true, useOrder: true, useHeight: true },
    ["Book Notes"]: { sortMethod: "A", category: "Book Notes", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Print or manuscript"]: { sortMethod: "A", category: "Print or manuscript", func: "scaleOrdinal", scheme: "schemeDark2", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["STC or Wing"]: { sortMethod: "A", category: "STC or Wing", func: "scaleOrdinal", scheme: "schemeDark2", useColour: false, useSection: false, useOrder: true, useHeight: false },
    ["Shelfmark"]: { sortMethod: "A", category: "Shelfmark", useColour: false },
    ["Marginal Marks"]: { sortMethod: "A", category: "Marginal Marks", useColour: false, useSection: false, useOrder: false, useHeight: false },
    ["Book image/s"]: { sortMethod: "A", category: "Book image/s", useColour: false, useSection: false, useOrder: true, useHeight: false },
    ["Number of marks"]: { sortMethod: "1", category: "Number of marks", func: "scaleSequential", scheme: "interpolatePlasma", useColour: true, useSection: true, useOrder: true, useHeight: true },
    ["Number of book images"]: { sortMethod: "1", category: "Number of book images", func: "scaleSequential", scheme: "interpolateCool", useColour: true, useSection: true, useOrder: true, useHeight: true }
  });
  viewMap.set("Agent", {
    ["FemaleAgentID"]: { sortMethod: "1", category: "FemaleAgentID", func: "scaleSequential", scheme: "interpolatePuRd", useColour: true, useSection: false, useOrder: true, useHeight: false },
    ["Female agent name"]: { sortMethod: "A", category: "Female agent name", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Female agent date"]: { sortMethod: "1", category: "Female agent date", func: "scaleSequential", scheme: "interpolateSpectral", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Female agent bio"]: { sortMethod: "A", category: "Female agent bio", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Number of marks"]: { sortMethod: "1", category: "Number of marks", func: "scaleSequential", scheme: "interpolateBuPu", useColour: true, useSection: true, useOrder: true, useHeight: true }
  });
  viewMap.set("Mark", {
    ["MargID"]: { sortMethod: "1", category: "MargID", func: "scaleSequential", scheme: "interpolateRdPu", useColour: true, useSection: false, useOrder: true, useHeight: false },
    ["Notes"]: { sortMethod: "A", category: "Notes", useColour: false, useSection: false, useOrder: false, useHeight: false },
    ["Ownership type"]: { sortMethod: "A", category: "Ownership type", func: "scaleOrdinal", scheme: "schemeSet1", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Distribution"]: { sortMethod: "A", category: "Distribution", func: "scaleOrdinal", scheme: "schemePastel1", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Female agent status"]: { sortMethod: "A", category: "Female agent status", func: "scaleOrdinal", scheme: "schemeSet1", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Annotation type"]: { sortMethod: "A", category: "Annotation type", func: "scaleOrdinal", scheme: "schemeSet2", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Location sig. ; p. ; pp."]: { sortMethod: "A", category: "Location sig. ; p. ; pp.", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Recording type"]: { sortMethod: "A", category: "Recording type", func: "scaleOrdinal", scheme: "schemeSet2", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Transcription"]: { sortMethod: "A", category: "Transcription", useColour: false, useSection: true, useOrder: true, useHeight: false },
    ["Mark type (Mark of?)"]: { sortMethod: "A", category: "Mark type (Mark of?)", func: "scaleOrdinal", scheme: "schemeTableau10", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Images of marginal mark"]: { sortMethod: "A", category: "Images of marginal mark", useColour: false, useSection: false, useOrder: false, useHeight: false },
    ["Class"]: { sortMethod: "A", category: "Class", func: "scaleOrdinal", scheme: "schemeAccent", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Position on page"]: { sortMethod: "A", category: "Position on page", func: "scaleOrdinal", scheme: "schemeSet3", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Location other"]: { sortMethod: "A", category: "Location other", func: "scaleOrdinal", scheme: "schemeSet3", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Added text type"]: { sortMethod: "A", category: "Added text type", func: "scaleOrdinal", scheme: "schemeAccent", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Drawing type"]: { sortMethod: "A", category: "Drawing type", func: "scaleOrdinal", scheme: "schemeDark2", useColour: true, useSection: true, useOrder: true, useHeight: false },
    ["Graffiti type"]: { sortMethod: "A", category: "Graffiti type", func: "scaleOrdinal", scheme: "schemeDark2", useColour: TRUE, useSection: true, useOrder: true, useHeight: false },
    ["Agent role"]: { sortMethod: "A", category: "Agent role", func: "scaleOrdinal", scheme: "schemeAccent", useColour: true },
    ["Other notes"]: { sortMethod: "A", category: "Other notes", useColour: false, useSection: true, useOrder: true, useHeight: false }
  });
  const colourMapFiltered = reactive(/* @__PURE__ */ new Map());
  const colourMapTemp = new Map(categoryMap);
  const bookColour = viewMap.get("Book");
  const agentColour = viewMap.get("Agent");
  const markColour = viewMap.get("Mark");
  const bookFilter = JSON.parse(JSON.stringify(colourMapTemp.get("Book")));
  const agentFilter = JSON.parse(JSON.stringify(colourMapTemp.get("Agent")));
  const markFilter = JSON.parse(JSON.stringify(colourMapTemp.get("Mark")));
  Object.keys(bookFilter).forEach((key) => {
    if (!bookColour[key].useColour)
      delete bookFilter[key];
  });
  Object.keys(agentFilter).forEach((key) => {
    if (!agentColour[key].useColour)
      delete agentFilter[key];
  });
  Object.keys(markFilter).forEach((key) => {
    if (!markColour[key].useColour)
      delete markFilter[key];
  });
  colourMapFiltered.set("Book", bookFilter);
  colourMapFiltered.set("Agent", agentFilter);
  colourMapFiltered.set("Mark", markFilter);
  const agentsInCollection = {
    //Query - How Many Agents In Collection?
    view: {
      itemType: "Agent",
      id: "FemaleAgentID",
      shelf: "Not Selected",
      //Primary sort
      bookend: "Not Selected",
      //Secondary sort
      height: "Not Selected",
      colour: "Female agent status"
    },
    viewType: {
      id: "Agent",
      shelf: "NotSelected",
      bookend: "NotSelected",
      height: "NotSelected",
      colour: "Mark"
    },
    pageText: {
      queryType: "Agents ",
      queryBreadcrumb: "/ How many agents are in the collection ?",
      libraryTypeTitle: "The Agents",
      libraryTypeSubtitle: "in the libraries"
    }
  };
  const viewRouteQueries = reactive({
    agent01: agentsInCollection
  });
  const libraryItemBundle = computed(() => {
    return {
      Agent: {
        labelViewMode: "agentLabel",
        menuHeader: "Agent",
        menuSubheader: "Female agent name",
        ownProp1: "Female agent date",
        ownProp2: "Female agent bio",
        ownProp3: "Number of marks",
        collectionProp1: "agentCollectionProp1",
        collectionProp2: "agentCollectionProp2",
        viewProp1: "height",
        viewProp2: "colour",
        viewProp3: "shelf",
        viewProp4: "bookend",
        itemType: "Agent",
        yourShelfFunction(item) {
          return addToShelf(item);
        },
        //Method property shorthand
        yourShelfText: "Add to Collection"
      },
      Book: {
        labelViewMode: "bookLabel",
        menuHeader: "Book",
        menuSubheader: "Shelfmark",
        ownProp1: "Title",
        ownProp2: "Author",
        ownProp3: "Date of publication",
        collectionProp1: "bookCollectionProp1",
        collectionProp2: "bookCollectionProp2",
        viewProp1: "height",
        viewProp2: "colour",
        viewProp3: "shelf",
        viewProp4: "bookend",
        itemType: "Book",
        yourShelfFunction(item) {
          return addToShelf(item);
        },
        //Method property shorthand
        yourShelfText: "Add to Collection"
      },
      Mark: {
        labelViewMode: "markLabel",
        menuHeader: "Mark",
        menuSubheader: "Transcription",
        ownProp1: "Mark type (Mark of?)",
        ownProp2: "Distribution",
        ownProp3: "Female agent status",
        collectionProp1: "markCollectionProp1",
        collectionProp2: "markCollectionProp2",
        viewProp1: "height",
        viewProp2: "colour",
        viewProp3: "shelf",
        viewProp4: "bookend",
        itemType: "Mark",
        yourShelfFunction(item) {
          return addToShelf(item);
        },
        //Method property shorthand
        yourShelfText: "Add to Collection"
      }
    };
  });
  let colourBundle = JSON.parse(JSON.stringify(libraryItemBundle.value));
  Object.keys(colourBundle).forEach((key) => {
    colourBundle[key].labelViewMode = "colour";
    colourBundle[key].yourShelfFunction = addToShelf;
  });
  const viewColourItemBundle = computed(() => {
    return colourBundle;
  });
  const viewEditItemBundle = computed(() => {
    return libraryItemBundle.value;
  });
  let shelfBundle = JSON.parse(JSON.stringify(libraryItemBundle.value));
  Object.keys(shelfBundle).forEach((key) => {
    shelfBundle[key].yourShelfFunction = removeFromShelf;
    shelfBundle[key].yourShelfText = "Remove from Collection";
  });
  const yourShelfItemBundle = computed(() => {
    return shelfBundle;
  });
  console.log(yourShelfItemBundle);
  return {
    categoryMap,
    invCategoryMap,
    viewMap,
    colourMapFiltered,
    scales,
    viewRouteQueries,
    libraryItemBundle,
    yourShelfItemBundle,
    viewEditItemBundle,
    viewColourItemBundle
  };
});
const useViewStore = defineStore("view", () => {
  const { viewMap, colourMapFiltered, scales } = useReferenceStore();
  const {
    handleNumeric,
    handleObjectPath,
    handleValue,
    handleArray,
    handleColourValue,
    isNumber,
    isString,
    isArray,
    containsNumber,
    processDomain
  } = useUtils();
  const libraryData = ref({});
  const heightCategory = {
    logarithmic: ["Number of marks", "Number of book images", "Size"],
    year: ["Date of publication", "Female agent date"]
  };
  const libraryDisplay = reactive({
    //sub items in view and viewType are called the 'viewMode'.
    view: {
      itemType: "Book",
      id: "BookID",
      shelf: "Repository",
      //Primary sort
      bookend: "Date of publication",
      //Secondary sort
      shelfOrderMethod: "A",
      //Primary sort
      bookendOrderMethod: "A",
      //Secondary sort
      height: "Date of publication",
      colour: "Genre/Identity",
      label: "Title",
      agentLabel: "Female agent name",
      bookLabel: "Title",
      markLabel: "Transcription",
      agentCollectionProp1: "Mark type (Mark of?)",
      agentCollectionProp2: "Genre/Identity",
      bookCollectionProp1: "Female agent name",
      bookCollectionProp2: "Number of marks",
      markCollectionProp1: "Female agent name",
      markCollectionProp2: "Title"
    },
    viewType: {
      id: "Book",
      shelf: "Book",
      bookend: "Book",
      height: "Book",
      colour: "Book",
      label: "Book",
      agentLabel: "Agent",
      bookLabel: "Book",
      markLabel: "Mark",
      agentCollectionProp1: "Mark",
      agentCollectionProp2: "Book",
      bookCollectionProp1: "Agent",
      bookCollectionProp2: "Book",
      markCollectionProp1: "Agent",
      markCollectionProp2: "Book"
    },
    pageText: {
      queryType: "Agents ",
      queryBreadcrumb: "/ How many agents are in the collection ?",
      libraryTypeTitle: "The Agents",
      libraryTypeSubtitle: "of the libraries"
    }
  });
  const formattedLibrary = ref([]);
  const itemHeight = ref();
  const itemColour = ref();
  const colourSet = ref();
  watch([libraryData, libraryDisplay], () => {
    if (libraryData.value.length !== void 0) {
      formattedLibrary.value = formatLibrary(libraryData.value);
      itemHeight.value = formatHeight(libraryData.value);
      itemColour.value = formatColour();
      colourSet.value = getColourSet.value;
    }
  });
  const getDomainIndex = computed(() => {
    return {
      min: d3.minIndex(libraryData.value, (d) => getIDP(d, "height")),
      max: d3.maxIndex(libraryData.value, (d) => getIDP(d, "height"))
    };
  });
  const getColourSet = computed(() => {
    return processColourSet(libraryData.value);
  });
  const viewHeightBounds = computed(() => {
    return [
      libraryData.value[getDomainIndex.value.min],
      libraryData.value[getDomainIndex.value.max]
    ];
  });
  const viewColourSet = computed(() => {
    return processColourItems(libraryData.value, getColourSet.value);
  });
  function formatShelf(data, viewMode) {
    return d3.flatGroup(d3.sort(data, (d) => getIDP(d, viewMode)), (d) => getIDP(d, viewMode));
  }
  function formatNullShelf(data, viewMode) {
    return d3.flatGroup(d3.sort(data, (d) => getIDP(d, viewMode)), (d) => "All Items");
  }
  function formatBookend(data, viewMode) {
    return data.map((d) => [d[0], d3.flatGroup(d3.sort(d[1], (d2) => getIDP(d2, viewMode)), (d2) => getIDP(d2, viewMode))]);
  }
  function formatNullBookend(data, viewMode) {
    return data.map((d) => [d[0], d3.flatGroup(d3.sort(d[1], (d2) => getIDP(d2, viewMode)), (d2) => "All Items")]);
  }
  function formatLibrary(data) {
    const shelfFormatData = libraryDisplay.view.shelf !== "Not Selected" ? formatShelf(data, "shelf") : formatNullShelf(data, "id");
    const shelfBookendFormatData = libraryDisplay.view.bookend !== "Not Selected" ? formatBookend(shelfFormatData, "bookend") : formatNullBookend(shelfFormatData, "id");
    return shelfBookendFormatData;
  }
  function formatHeight(data) {
    const viewSelection = libraryDisplay.view.height;
    if (viewSelection !== "Not Selected") {
      if (heightCategory.logarithmic.includes(viewSelection)) {
        return (value) => {
          return d3.scaleLinear().domain(chooseHeightDomain(data).map((d) => Math.log(d))).unknown(scales.maxItemHeight).range([scales.minItemHeight, scales.maxItemHeight]).clamp(true)(Math.log(value));
        };
      } else {
        return d3.scaleLinear().domain(chooseHeightDomain(data)).unknown(scales.maxItemHeight).range([scales.minItemHeight, scales.maxItemHeight]).clamp(true);
      }
    } else {
      return (_) => {
        return scales.maxItemHeight;
      };
    }
  }
  function chooseHeightDomain(data) {
    const viewSelection = libraryDisplay.view.height;
    const domainIndex = getDomainIndex.value;
    if (heightCategory.year.includes(viewSelection)) {
      return [1450, 1750];
    } else {
      return [getIDP(data[domainIndex.min], "height"), getIDP(data[domainIndex.max], "height")];
    }
  }
  function formatColour() {
    if (libraryDisplay.view.colour !== "Not Selected") {
      const viewMode = "colour";
      const viewSelection = libraryDisplay.view[viewMode];
      const viewModeType = libraryDisplay.viewType[viewMode];
      const colourFunction = viewMap.get(viewModeType)[viewSelection].func;
      const colourScheme = viewMap.get(viewModeType)[viewSelection].scheme;
      const colourScale = colourBandscale(getColourSet.value);
      const colourFunc = d3[colourFunction](d3[colourScheme]);
      return (value) => colourFunc(colourScale(value));
    } else {
      return (_) => {
        return "#fff281";
      };
    }
  }
  function colourBandscale(colourSet2) {
    return d3.scaleBand().domain(Array.from(colourSet2));
  }
  function processColourSet(data) {
    return new Set(data.flatMap((d) => getIDP(d, "colour")).sort(alphabetically(true)));
  }
  function processColourItems(data, colourSet2) {
    let tempColourSet = colourSet2;
    const uniqueColours = data.filter((d) => {
      const value = getIDP(d, "colour");
      if (tempColourSet.has(value)) {
        return tempColourSet.delete(value);
      } else {
        return false;
      }
    });
    return new Set(uniqueColours.sort((a, b) => alphabetically(true)(getIDP(a, "colour"), getIDP(b, "colour"))));
  }
  async function parseDatabase(tableData) {
    libraryData.value = await JSON.parse(JSON.stringify(tableData));
  }
  const dataSize = computed(() => {
    return libraryData.value.length ? libraryData.value.length : 0;
  });
  function handleViewSelection(viewMode, viewSelection, itemType) {
    console.log("handleViewSelection", viewMode, viewSelection, itemType);
    if (itemType === "NotSelected") {
      libraryDisplay.view[viewMode] = "Not Selected";
      libraryDisplay.viewType[viewMode] = "NotSelected";
    } else {
      if (viewMode === "shelf") {
        libraryDisplay.view.shelfOrderMethod = viewMap.get(itemType)[viewSelection].sortMethod;
      }
      if (viewMode === "bookend") {
        libraryDisplay.view.bookendOrderMethod = viewMap.get(itemType)[viewSelection].sortMethod;
      }
      libraryDisplay.view[viewMode] = viewSelection;
      libraryDisplay.viewType[viewMode] = itemType;
    }
  }
  function getIDP(item, viewMode) {
    let value;
    if (!item)
      return null;
    if (viewMode === "Not Selected")
      return "Not Selected";
    const viewSelection = libraryDisplay.view[viewMode];
    const viewModeType = libraryDisplay.viewType[viewMode];
    const itemType = itemTypeCheck(item);
    if (itemType === "Agent") {
      if (viewModeType === "Agent")
        value = handleObjectPath(item, viewMode, viewSelection);
      if (viewModeType === "Mark")
        value = handleObjectPath(item, viewMode, "Marks", 0, viewSelection);
      if (viewModeType === "Book")
        value = handleObjectPath(item, viewMode, "Marks", 0, "Books", viewSelection);
    } else if (itemType === "Book") {
      if (viewModeType === "Book")
        value = handleObjectPath(item, viewMode, viewSelection);
      if (viewModeType === "Mark")
        value = handleObjectPath(item, viewMode, "Marks", 0, viewSelection);
      if (viewModeType === "Agent")
        value = handleObjectPath(item, viewMode, "Marks", 0, "Agents", viewSelection);
    } else if (itemType === "Mark") {
      if (viewModeType === "Mark")
        value = handleObjectPath(item, viewMode, viewSelection);
      if (viewModeType === "Agent")
        value = handleObjectPath(item, viewMode, "Agents", viewSelection);
      if (viewModeType === "Book")
        value = handleObjectPath(item, viewMode, "Books", viewSelection);
    }
    return value ? value : "no data";
  }
  function itemTypeCheck(item) {
    return item["FemaleAgentID"] ? "Agent" : item["BookID"] ? "Book" : item["MargID"] ? "Mark" : "";
  }
  function alphabetically(ascending) {
    return function(a, b) {
      if (a === b) {
        return 0;
      }
      if (a === "no data") {
        return 1;
      }
      if (b === "no data") {
        return -1;
      }
      if (ascending) {
        return a < b ? -1 : 1;
      }
      return a < b ? 1 : -1;
    };
  }
  return {
    libraryData,
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
    itemTypeCheck
  };
});
const _sfc_main$2 = {
  __name: "AgentItem",
  __ssrInlineRender: true,
  props: ["item", "itemBundle"],
  setup(__props) {
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      formattedLibrary,
      itemHeight,
      itemColour,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      scales
    } = storeToRefs(referenceStore);
    const {
      handleObjectProperty,
      contrastHandler
    } = useUtils();
    const isHighlight = ref(false);
    const itemHandlers = {
      mouseover: handleMouseOver,
      mouseout: handleMouseOut
    };
    function handleMouseOver(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, true));
    }
    function handleMouseOut(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, false));
    }
    function getUpPos(elm, isUp) {
      if (elm.classList.contains("item-wrapper")) {
        return `translate(0, ${isUp ? -10 : 0}px)`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VMenu = resolveComponent("VMenu");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_VMenu, {
        placement: "top",
        delay: { show: 50, hide: 200 }
      }, {
        popper: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-menu-container scrollable"${_scopeId}><div class="item-menu-header-container"${_scopeId}><h2 class="item-menu-header"${_scopeId}>${ssrInterpolate(__props.itemBundle.menuHeader)}</h2><h2 class="item-menu-subheader"${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader))}</h2><p class="item-menu-subheader-type"${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader])}</p></div><div class="item-menu"${_scopeId}><div class="shelf-button-wrapper"${_scopeId}><button class="shelf-button"${_scopeId}>${ssrInterpolate(__props.itemBundle.yourShelfText)}</button></div><ul${_scopeId}><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, "colour"))}</p></li></ul><div class="item-view"${_scopeId}><div class="item-view-header-container"${_scopeId}><h2 class="item-view-header"${_scopeId}>View Features</h2></div><ul${_scopeId}><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp1)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp1))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp2)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, "colour"))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp3)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp3))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp4)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp4))}</h3></li></ul></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "item-menu-container scrollable" }, [
                createVNode("div", { class: "item-menu-header-container" }, [
                  createVNode("h2", { class: "item-menu-header" }, toDisplayString(__props.itemBundle.menuHeader), 1),
                  createVNode("h2", { class: "item-menu-subheader" }, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader)), 1),
                  createVNode("p", { class: "item-menu-subheader-type" }, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader]), 1)
                ]),
                createVNode("div", { class: "item-menu" }, [
                  createVNode("div", { class: "shelf-button-wrapper" }, [
                    createVNode("button", {
                      class: "shelf-button",
                      onClick: ($event) => __props.itemBundle.yourShelfFunction(__props.item)
                    }, toDisplayString(__props.itemBundle.yourShelfText), 9, ["onClick"])
                  ]),
                  createVNode("ul", null, [
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, "colour")), 1)
                    ])
                  ]),
                  createVNode("div", { class: "item-view" }, [
                    createVNode("div", { class: "item-view-header-container" }, [
                      createVNode("h2", { class: "item-view-header" }, "View Features")
                    ]),
                    createVNode("ul", null, [
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp1), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp1)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp2), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, "colour")), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp3), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp3)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp4), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp4)), 1)
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-wrapper" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" })}"${_scopeId}><div class="agent-item-background" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + 4 + "px" })}"${_scopeId}></div><div style="${ssrRenderStyle({
              maxHeight: unref(scales).maxItemHeight - 4 + "px",
              height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 4 + "px",
              background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
              width: unref(scales).minItemWidth + "px"
            })}" class="${ssrRenderClass([{ lowlight: unref(isHighlight) }, "agent-item"])}"${_scopeId}><div class="item-value" style="${ssrRenderStyle({ color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) })}"${_scopeId}><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode))}</p></div></div></div>`);
          } else {
            return [
              createVNode("div", mergeProps({ class: "item-wrapper" }, toHandlers(itemHandlers, true), {
                style: { maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" }
              }), [
                createVNode("div", {
                  class: "agent-item-background",
                  style: { maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + 4 + "px" }
                }, null, 4),
                createVNode("div", {
                  class: ["agent-item", { lowlight: unref(isHighlight) }],
                  style: {
                    maxHeight: unref(scales).maxItemHeight - 4 + "px",
                    height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 4 + "px",
                    background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
                    width: unref(scales).minItemWidth + "px"
                  }
                }, [
                  createVNode("div", {
                    class: "item-value",
                    style: { color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) }
                  }, [
                    createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode)), 1)
                  ], 4)
                ], 6)
              ], 16)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="section-shelf-box"></div><!--]-->`);
    };
  }
};
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AgentItem.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const __nuxt_component_0 = _sfc_main$2;
const _sfc_main$1 = {
  __name: "BookItem",
  __ssrInlineRender: true,
  props: ["item", "itemBundle"],
  setup(__props) {
    useSupabaseClient();
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      formattedLibrary,
      itemHeight,
      itemColour,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      scales
    } = storeToRefs(referenceStore);
    const {
      handleObjectProperty,
      contrastHandler
    } = useUtils();
    const isHighlight = ref(false);
    const itemHandlers = {
      mouseover: handleMouseOver,
      mouseout: handleMouseOut
    };
    ref(
      {
        image: "",
        title: "my title",
        content: "my content"
      }
    );
    function handleMouseOver(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, true));
    }
    function handleMouseOut(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, false));
    }
    function getUpPos(elm, isUp) {
      if (elm.classList.contains("item-wrapper")) {
        return `translate(0, ${isUp ? -10 : 0}px)`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VMenu = resolveComponent("VMenu");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_VMenu, {
        placement: "top",
        delay: { show: 50, hide: 200 }
      }, {
        popper: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-menu-container scrollable"${_scopeId}><div class="item-menu-header-container"${_scopeId}><h2 class="item-menu-header"${_scopeId}>${ssrInterpolate(__props.itemBundle.menuHeader)}</h2><h2 class="item-menu-subheader"${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader))}</h2><p class="item-menu-subheader-type"${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader])}</p></div><div class="item-menu"${_scopeId}><div class="shelf-button-wrapper"${_scopeId}><button class="shelf-button"${_scopeId}>${ssrInterpolate(__props.itemBundle.yourShelfText)}</button></div><ul${_scopeId}><li${_scopeId}></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.collectionProp2))}</p></li></ul><div class="item-view"${_scopeId}><div class="item-view-header-container"${_scopeId}><h2 class="item-view-header"${_scopeId}>View Features</h2></div><ul${_scopeId}><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp1)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp1))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp2)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp2))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp3)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp3))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp4)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp4))}</h3></li></ul></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "item-menu-container scrollable" }, [
                createVNode("div", { class: "item-menu-header-container" }, [
                  createVNode("h2", { class: "item-menu-header" }, toDisplayString(__props.itemBundle.menuHeader), 1),
                  createVNode("h2", { class: "item-menu-subheader" }, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader)), 1),
                  createVNode("p", { class: "item-menu-subheader-type" }, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader]), 1)
                ]),
                createVNode("div", { class: "item-menu" }, [
                  createVNode("div", { class: "shelf-button-wrapper" }, [
                    createVNode("button", {
                      class: "shelf-button",
                      onClick: ($event) => __props.itemBundle.yourShelfFunction(__props.item)
                    }, toDisplayString(__props.itemBundle.yourShelfText), 9, ["onClick"])
                  ]),
                  createVNode("ul", null, [
                    createVNode("li"),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.collectionProp2)), 1)
                    ])
                  ]),
                  createVNode("div", { class: "item-view" }, [
                    createVNode("div", { class: "item-view-header-container" }, [
                      createVNode("h2", { class: "item-view-header" }, "View Features")
                    ]),
                    createVNode("ul", null, [
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp1), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp1)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp2), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp2)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp3), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp3)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp4), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp4)), 1)
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-wrapper" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" })}"${_scopeId}><div class="book-item-background" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + 4 + "px" })}"${_scopeId}></div><div style="${ssrRenderStyle({
              maxHeight: unref(scales).maxItemHeight - 4 + "px",
              height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 4 + "px",
              background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
              width: unref(scales).minItemWidth + "px"
            })}" class="${ssrRenderClass([{ lowlight: unref(isHighlight) }, "book-item"])}"${_scopeId}><div class="item-value" style="${ssrRenderStyle({ color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) })}"${_scopeId}><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode))}</p></div></div></div>`);
          } else {
            return [
              createVNode("div", mergeProps({ class: "item-wrapper" }, toHandlers(itemHandlers, true), {
                style: { maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" }
              }), [
                createVNode("div", {
                  class: "book-item-background",
                  style: { maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + 4 + "px" }
                }, null, 4),
                createVNode("div", {
                  class: ["book-item", { lowlight: unref(isHighlight) }],
                  style: {
                    maxHeight: unref(scales).maxItemHeight - 4 + "px",
                    height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 4 + "px",
                    background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
                    width: unref(scales).minItemWidth + "px"
                  }
                }, [
                  createVNode("div", {
                    class: "item-value",
                    style: { color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) }
                  }, [
                    createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode)), 1)
                  ], 4)
                ], 6)
              ], 16)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="section-shelf-box"></div><!--]-->`);
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/BookItem.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const __nuxt_component_1 = _sfc_main$1;
const _sfc_main = {
  __name: "MarkItem",
  __ssrInlineRender: true,
  props: ["item", "itemBundle"],
  setup(__props) {
    const viewStore = useViewStore();
    const {
      libraryData,
      libraryDisplay,
      formattedLibrary,
      itemHeight,
      itemColour,
      viewHeightBounds,
      viewColourSet
    } = storeToRefs(viewStore);
    const {
      parseDatabase,
      handleViewSelection,
      getIDP,
      itemTypeCheck
    } = useViewStore();
    const yourShelfStore = useYourShelfStore();
    storeToRefs(yourShelfStore);
    useYourShelfStore();
    const referenceStore = useReferenceStore();
    const {
      categoryMap,
      invCategoryMap,
      scales
    } = storeToRefs(referenceStore);
    const {
      handleObjectProperty,
      contrastHandler
    } = useUtils();
    const isHighlight = ref(false);
    const itemHandlers = {
      mouseover: handleMouseOver,
      mouseout: handleMouseOut
    };
    function handleMouseOver(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, true));
    }
    function handleMouseOut(d) {
      d3.select(d.currentTarget).style("transform", getUpPos(d.currentTarget, false));
    }
    function getUpPos(elm, isUp) {
      if (elm.classList.contains("item-wrapper")) {
        return `translate(0, ${isUp ? -10 : 0}px)`;
      }
    }
    return (_ctx, _push, _parent, _attrs) => {
      const _component_VMenu = resolveComponent("VMenu");
      _push(`<!--[-->`);
      _push(ssrRenderComponent(_component_VMenu, {
        placement: "top",
        delay: { show: 50, hide: 200 }
      }, {
        popper: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-menu-container scrollable"${_scopeId}><div class="item-menu-header-container"${_scopeId}><h2 class="item-menu-header"${_scopeId}>${ssrInterpolate(__props.itemBundle.menuHeader)}</h2><h2 class="item-menu-subheader"${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader))}</h2><p class="item-menu-subheader-type"${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader])}</p></div><div class="item-menu"${_scopeId}><div class="shelf-button-wrapper"${_scopeId}><button class="shelf-button"${_scopeId}>${ssrInterpolate(__props.itemBundle.yourShelfText)}</button></div><ul${_scopeId}><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3])}</h4><p${_scopeId}>${ssrInterpolate(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1))}</p></li><li${_scopeId}><h4${_scopeId}>${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]])}</h4><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.collectionProp2))}</p></li></ul><div class="item-view"${_scopeId}><div class="item-view-header-container"${_scopeId}><h2 class="item-view-header"${_scopeId}>View Features</h2></div><ul${_scopeId}><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp1)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp1))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp2)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp2))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp3)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp3))}</h3></li><li${_scopeId}><p class="item-view-subheader-type"${_scopeId}>${ssrInterpolate(__props.itemBundle.viewProp4)}</p><h4${_scopeId}>${ssrInterpolate(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])} | ${ssrInterpolate(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]])}</h4><h3${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.viewProp4))}</h3></li></ul></div></div></div>`);
          } else {
            return [
              createVNode("div", { class: "item-menu-container scrollable" }, [
                createVNode("div", { class: "item-menu-header-container" }, [
                  createVNode("h2", { class: "item-menu-header" }, toDisplayString(__props.itemBundle.menuHeader), 1),
                  createVNode("h2", { class: "item-menu-subheader" }, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.menuSubheader)), 1),
                  createVNode("p", { class: "item-menu-subheader-type" }, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.menuSubheader]), 1)
                ]),
                createVNode("div", { class: "item-menu" }, [
                  createVNode("div", { class: "shelf-button-wrapper" }, [
                    createVNode("button", {
                      class: "shelf-button",
                      onClick: ($event) => __props.itemBundle.yourShelfFunction(__props.item)
                    }, toDisplayString(__props.itemBundle.yourShelfText), 9, ["onClick"])
                  ]),
                  createVNode("ul", null, [
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp1]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp2]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp2)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(__props.itemBundle.itemType)[__props.itemBundle.ownProp3]), 1),
                      createVNode("p", null, toDisplayString(unref(handleObjectProperty)(__props.item, __props.itemBundle.ownProp3)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp1])[unref(libraryDisplay).view[__props.itemBundle.collectionProp1]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.collectionProp1)), 1)
                    ]),
                    createVNode("li", null, [
                      createVNode("h4", null, toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.collectionProp2])[unref(libraryDisplay).view[__props.itemBundle.collectionProp2]]), 1),
                      createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.collectionProp2)), 1)
                    ])
                  ]),
                  createVNode("div", { class: "item-view" }, [
                    createVNode("div", { class: "item-view-header-container" }, [
                      createVNode("h2", { class: "item-view-header" }, "View Features")
                    ]),
                    createVNode("ul", null, [
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp1), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp1])[unref(libraryDisplay).view[__props.itemBundle.viewProp1]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp1)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp2), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp2])[unref(libraryDisplay).view[__props.itemBundle.viewProp2]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp2)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp3), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp3])[unref(libraryDisplay).view[__props.itemBundle.viewProp3]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp3)), 1)
                      ]),
                      createVNode("li", null, [
                        createVNode("p", { class: "item-view-subheader-type" }, toDisplayString(__props.itemBundle.viewProp4), 1),
                        createVNode("h4", null, toDisplayString(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4]) + " | " + toDisplayString(unref(categoryMap).get(unref(libraryDisplay).viewType[__props.itemBundle.viewProp4])[unref(libraryDisplay).view[__props.itemBundle.viewProp4]]), 1),
                        createVNode("h3", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.viewProp4)), 1)
                      ])
                    ])
                  ])
                ])
              ])
            ];
          }
        }),
        default: withCtx((_, _push2, _parent2, _scopeId) => {
          if (_push2) {
            _push2(`<div class="item-wrapper" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" })}"${_scopeId}><div class="mark-item-top" style="${ssrRenderStyle({ background: unref(itemColour)(unref(getIDP)(__props.item, "colour")), width: unref(scales).minItemWidth - 2 + "px" })}"${_scopeId}></div><div class="mark-item-top-background" style="${ssrRenderStyle({ width: unref(scales).minItemWidth + 2 + "px" })}"${_scopeId}></div><div class="mark-item-background" style="${ssrRenderStyle({ maxHeight: unref(scales).maxItemHeight - 20 + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 20 + "px", width: unref(scales).minItemWidth + 2 + "px" })}"${_scopeId}></div><div style="${ssrRenderStyle({
              maxHeight: unref(scales).maxItemHeight - 23 + "px",
              height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 23 + "px",
              background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
              width: unref(scales).minItemWidth - 2 + "px"
            })}" class="${ssrRenderClass([{ lowlight: unref(isHighlight) }, "mark-item"])}"${_scopeId}><div class="item-value" style="${ssrRenderStyle({ color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) })}"${_scopeId}><p${_scopeId}>${ssrInterpolate(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode))}</p></div></div></div>`);
          } else {
            return [
              createVNode("div", mergeProps({ class: "item-wrapper" }, toHandlers(itemHandlers, true), {
                style: { maxHeight: unref(scales).maxItemHeight + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) + "px", width: unref(scales).minItemWidth + "px" }
              }), [
                createVNode("div", {
                  class: "mark-item-top",
                  style: { background: unref(itemColour)(unref(getIDP)(__props.item, "colour")), width: unref(scales).minItemWidth - 2 + "px" }
                }, null, 4),
                createVNode("div", {
                  class: "mark-item-top-background",
                  style: { width: unref(scales).minItemWidth + 2 + "px" }
                }, null, 4),
                createVNode("div", {
                  class: "mark-item-background",
                  style: { maxHeight: unref(scales).maxItemHeight - 20 + "px", height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 20 + "px", width: unref(scales).minItemWidth + 2 + "px" }
                }, null, 4),
                createVNode("div", {
                  class: ["mark-item", { lowlight: unref(isHighlight) }],
                  style: {
                    maxHeight: unref(scales).maxItemHeight - 23 + "px",
                    height: unref(itemHeight)(unref(getIDP)(__props.item, "height")) - 23 + "px",
                    background: unref(itemColour)(unref(getIDP)(__props.item, "colour")),
                    width: unref(scales).minItemWidth - 2 + "px"
                  }
                }, [
                  createVNode("div", {
                    class: "item-value",
                    style: { color: unref(contrastHandler)(unref(itemColour)(unref(getIDP)(__props.item, "colour"))) }
                  }, [
                    createVNode("p", null, toDisplayString(unref(getIDP)(__props.item, __props.itemBundle.labelViewMode)), 1)
                  ], 4)
                ], 6)
              ], 16)
            ];
          }
        }),
        _: 1
      }, _parent));
      _push(`<div class="section-shelf-box"></div><!--]-->`);
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/MarkItem.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
const __nuxt_component_2 = _sfc_main;

export { __nuxt_component_0 as _, useYourShelfStore as a, useReferenceStore as b, __nuxt_component_1 as c, __nuxt_component_2 as d, useViewStore as u };
//# sourceMappingURL=MarkItem-7373e2ae.mjs.map
