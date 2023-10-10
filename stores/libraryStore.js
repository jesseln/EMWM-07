// import { defineStore } from 'pinia'

export const useLibraryStore = defineStore('library', ()=>{
    const { getTable, getTableTest } = useDatabase();
    
    const items = ref([]); //Genereric Getting in case single table is required only
    const Agent = ref([]);
    const Book = ref([]);
    const Mark = ref([]);
    const libraryItemsTest = ref([])

    //Generic Getter - Returns single table as specified by tableName and orderColumn
    async function getItems(tableName, orderColumn) {
      items.value = await getTable(tableName, orderColumn)
    }

    //Returns Agent Structed Object - Relationally nested Marks then nested by Books 
    async function getAgents() {
      Agent.value = await getTable('Agents', 'FemaleAgentID')
    }

    //Returns Book Structed Object - Relationally nested Marks then nested by Agents
    async function getBooks() {
      Book.value = await getTable('Books', 'BookID')
    }

    //Returns Mark Structed Object - Relationally nested Books and Agents on same level 
    async function getMarks() {
      Mark.value = await getTable('Marks', 'MargID')
    }

    //Test Function
    async function getLibraryItemsTest(tableName, orderColumn) {
      libraryItemsTest.value = await getTableTest(tableName, orderColumn)
    }
  
  

      return {items, Agent, Book, Mark, getItems, getAgents, getBooks, getMarks, getLibraryItemsTest}
  })