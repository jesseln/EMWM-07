import { ref } from 'vue';
import { d as defineStore } from '../server.mjs';
import { u as useSupabaseClient } from './useSupabaseClient-f8b29b79.mjs';

const useDatabase = () => {
  const supabase = useSupabaseClient();
  async function getTable(tableName, orderColumn) {
    let tableSize = await getTableCount(tableName) || 0;
    let tableData = await getPaginatedData(tableName, orderColumn, 0, 999);
    while (tableSize > tableData.length) {
      await getPaginatedData(tableName, orderColumn, tableData.length, tableData.length + 1e3).then((data) => {
        tableData.push(...data);
      });
    }
    return tableData;
  }
  async function getTableTest(tableName, orderColumn) {
    let tableSize = await getTableCount(tableName) || 0;
    let tableData = await getPaginatedDataTest(tableName, orderColumn, 0, 999);
    while (tableSize > tableData.length) {
      await getPaginatedData(tableName, orderColumn, tableData.length, tableData.length + 1e3).then((data) => {
        tableData.push(...data);
      });
    }
    return tableData;
  }
  async function getSingleRecord(tableName, id) {
    const { data, error } = await supabase.from(tableName).select().eq(id.column, id.value).maybeSingle();
    if (error) {
      console.log(error);
    }
    if (data) {
      return data;
    }
  }
  async function getPaginatedData(tableName, orderColumn, from, to) {
    const objectStructure = tableStructure(tableName);
    const { data, count, error } = await supabase.from(tableName).select(
      objectStructure,
      { count: "exact" }
    ).order(orderColumn, { ascending: true }).range(from, to);
    if (error) {
      console.log(error);
    }
    if (data) {
      return data;
    }
  }
  async function getPaginatedDataTest(tableName, orderColumn, from, to) {
    const objectStructure = tableStructure(tableName);
    const { data, count, error } = await supabase.from(tableName).select(
      objectStructure,
      { count: "exact" }
    ).order(orderColumn, { ascending: true }).range(from, to);
    if (error) {
      console.log(error);
    }
    if (data) {
      return data;
    }
  }
  async function getTableCount(tableName) {
    const { data, count, error } = await supabase.from(tableName).select("*", { count: "exact", head: true });
    if (error) {
      console.log(error);
    }
    if (count) {
      return count;
    }
  }
  async function updateRecord(tableName, record, id) {
    const { data, error } = await supabase.from(tableName).update(record).eq(id.column, id.value).select();
    if (error) {
      console.log(error);
    }
    if (data) {
      return data;
    }
  }
  async function deleteRecord(tableName, id) {
    const { error } = await supabase.from(tableName).delete().eq(id.column, id.value);
    if (error) {
      console.log(error);
    }
  }
  async function updateCalulatedColumn(tableName, idColumn, sourceColumn, updateColumn, updateFunction) {
    const tableData = await getTable(tableName, idColumn);
    let updateCount = 0;
    let failCount = 0;
    for (var record of tableData) {
      let updateValue = updateFunction(record[sourceColumn]);
      if (updateValue) {
        console.log(`Pos ID ${record} + updateValue ${updateValue}`);
        updateCount++;
      } else {
        console.log(`Non-Zero Fail ID ${record} + updateValue ${updateValue}`);
        failCount++;
      }
    }
    console.log(updateCount, failCount);
  }
  function tableStructure(tableName) {
    if (tableName === "Agents")
      return `*, Marks(*, Books(*))`;
    if (tableName === "Books")
      return `*, Marks(*, Agents(*))`;
    if (tableName === "Marks")
      return `*, Agents(*), Books(*)`;
    return `*`;
  }
  return {
    getTable,
    getTableTest,
    updateCalulatedColumn,
    getSingleRecord,
    getPaginatedData,
    getTableCount,
    updateRecord,
    deleteRecord
  };
};
const useLibraryStore = defineStore("library", () => {
  const { getTable, getTableTest } = useDatabase();
  const items = ref([]);
  const Agent = ref([]);
  const Book = ref([]);
  const Mark = ref([]);
  const libraryItemsTest = ref([]);
  async function getItems(tableName, orderColumn) {
    items.value = await getTable(tableName, orderColumn);
  }
  async function getAgents() {
    Agent.value = await getTable("Agents", "FemaleAgentID");
  }
  async function getBooks() {
    Book.value = await getTable("Books", "BookID");
  }
  async function getMarks() {
    Mark.value = await getTable("Marks", "MargID");
  }
  async function getLibraryItemsTest(tableName, orderColumn) {
    libraryItemsTest.value = await getTableTest(tableName, orderColumn);
  }
  return { items, Agent, Book, Mark, getItems, getAgents, getBooks, getMarks, getLibraryItemsTest };
});

export { useLibraryStore as u };
//# sourceMappingURL=libraryStore-62e9feb9.mjs.map
