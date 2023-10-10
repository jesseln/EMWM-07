export const useDatabase = () => {
    const supabase: any = useSupabaseClient()
    
    async function getTable(tableName: string, orderColumn: string) {
        let tableSize: number =  await getTableCount(tableName) || 0;
        let tableData: any = await getPaginatedData(tableName,orderColumn,0,999);
  
        while(tableSize > tableData.length){
          await getPaginatedData(tableName,orderColumn, tableData.length, tableData.length + 1000)
          .then((data: any)=> {tableData.push(...data)})
        }
        return tableData
      }

      //Test Function
      async function getTableTest(tableName: string, orderColumn: string) {
        let tableSize: number =  await getTableCount(tableName) || 0;
        let tableData: any = await getPaginatedDataTest(tableName,orderColumn,0,999);
  
        while(tableSize > tableData.length){
          await getPaginatedData(tableName,orderColumn, tableData.length, tableData.length + 1000)
          .then((data: any)=> {tableData.push(...data)})
        }
        return tableData
      }

      async function getSingleRecord(tableName: string, id: {column: any, value: any}) {
        const { data, error } = await supabase
          .from(tableName)
          .select()
          .eq(id.column, id.value)
          .maybeSingle()
          
          if(error) {
            console.log(error)
          }
          if(data){
            return data
      }
      }
  
      async function getPaginatedData(tableName: string, orderColumn: string, from: number, to: number) {
        const objectStructure = tableStructure(tableName)
        const { data, count, error } = await supabase
          .from(tableName)
          .select(objectStructure, 
          { count: "exact" })
          .order(orderColumn, { ascending: true })
          .range(from, to)
  
          if(error) {
            console.log(error)
          }
          if(data){
            return data
      }
    }

    //Test Function
    async function getPaginatedDataTest(tableName: string, orderColumn: string, from: number, to: number) {
      const objectStructure = tableStructure(tableName)
      const { data, count, error } = await supabase
        .from(tableName)
        .select(objectStructure, 
        { count: "exact" })
        .order(orderColumn, { ascending: true })
        .range(from, to)

        if(error) {
          console.log(error)
        }
        if(data){
          return data
    }
  }
  
      async function getTableCount(tableName: string) {
        const { data, count, error } = await supabase
          .from(tableName)
          .select("*", { count: "exact", head: true })
          if(error) {
            console.log(error)
          }
          if(count){
            return count
          }
      }

      async function updateRecord(tableName: string, record: {[column: string]: [value: any]}, id: {column: any, value: any}) {
        const { data,error } = await supabase
          .from(tableName)
          .update(record)
          .eq(id.column, id.value)
          .select()
          if(error){
            console.log(error)
          }
          if(data){
            return data
          }
      }

      async function deleteRecord(tableName: string, id: {column: any, value: any}){
        const { error } = await supabase
          .from(tableName)
          .delete()
          .eq(id.column, id.value)
          if(error){
            console.log(error)
          }
      }

      //Updates column in table by applying a callback to a source column and returning the value to the update column.
      async function updateCalulatedColumn(tableName: string, idColumn: string, sourceColumn: any, updateColumn: any, updateFunction: any){
        const tableData: any = await getTable(tableName, idColumn)
        let updateCount: number = 0;
        let failCount: number = 0;
        for (var record of tableData) {
          let updateValue: any = updateFunction(record[sourceColumn])
          if(updateValue){
            // Activate below after checking console.log return
            // await updateRecord(tableName, {[updateColumn]: updateValue}, {column: idColumn, value: record[idColumn]}) 
            console.log(`Pos ID ${record} + updateValue ${updateValue}`)
            updateCount++
          }
          // Use below if Zero values are permitted
          // else if (updateValue === 0){
          //   await updateRecord(tableName, {[updateColumn]: updateValue}, {column: idColumn, value: record[idColumn]})
          //   console.log(`Fail ID ${record} + updateValue ${updateValue}`)
          //   failCount++
          // }
          else{
            console.log(`Non-Zero Fail ID ${record} + updateValue ${updateValue}`)
            failCount++
          }
        }
        console.log(updateCount, failCount)

        //Examples of previous calls
        /*
        updateCalulatedColumn('Books','BookID','Marginal Marks','Number of marks', (arr) => arr ? arr.length : 0)
        updateCalulatedColumn('Books','BookID','Book image/s','Number of book images', (arr) => arr ? arr.length : 0)
        updateCalulatedColumn('Agents','FemaleAgentID','MargID','Number of marks', (arr) => arr ? arr.length : 0)
        */
      }

      function tableStructure(tableName: string){
        if(tableName === 'Agents') return (`*, Marks(*, Books(*))`)
        if(tableName === 'Books') return (`*, Marks(*, Agents(*))`)
        if(tableName === 'Marks') return (`*, Agents(*), Books(*)`)
        return (`*`)
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
    }
}