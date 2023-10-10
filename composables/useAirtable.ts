export const useAirtable = () => {
    const supabase = useSupabaseClient()
    const { getTable, getSingleRecord, updateRecord } = useDatabase();


    async function createLocalKeyMap(tableData: any, tableName: string, idColumn: string, recordColumn: string, uuidColumn: string) {
        let uuidMap = new Map<string, string>();
        tableData.forEach((record: any) => {
            uuidMap.set(record[recordColumn], record[uuidColumn])
        })
        return uuidMap
    }

    function nullRecordCheck(tableData: any, nullCheckColumn: string, idColumn: string){
      let nullArray = new Array<number>();
      tableData.forEach((record: any) => {
        if(!record[nullCheckColumn]){
          nullArray.push(record[idColumn])
        }
      })
      console.log(nullArray)
      return nullArray
    }

    function mulitpleKeyCheck(tableData: any, multipleIDColumn: string, idColumn: string){
      let multipleIDArray = new Array<number>();
      tableData.forEach((record: any) => {
        if(record[multipleIDColumn].length>1 && typeof record[multipleIDColumn] !=='string'){
          multipleIDArray.push(record[idColumn])
        }
      })
      console.log(multipleIDArray)
      return multipleIDArray
    }

    async function mulitpleKeyRemove(tableData: any, tableName: string, multipleIDColumn: string, idColumn: string){
       for (var record of tableData) {
        if(record[multipleIDColumn].length>1){
          await updateRecord(tableName, {[multipleIDColumn]: [record[multipleIDColumn][0]]}, {column: idColumn, value: record[idColumn]})
          console.log(record[idColumn])
        }
      }
    }

    async function updateForeignKeyMap(tableName: string, idColumn: string, recordColumn: string, uuidColumn: string, 
                                foreignTableName: string, foreignIDColumn: string, foreignKeyColumn: string){
      const tableData: any = await getTable(tableName, idColumn)
      const foreignTableData: any = await getTable(foreignTableName, foreignIDColumn)
      //Ensure the UUID columns have been created in Supabase
      //Ensure that all numeric & sequential ID columns used for ordering are int8 not float
      //Ensure UUID column in local table is set to non-nullable and unique
      const uuidMap: Map<string, string> = await createLocalKeyMap(tableData, tableName, idColumn, recordColumn, uuidColumn)

      //Record Validity Checks - Do Null Values exist? & Do Multiple IDs exist?
      //Additionally always check the map is accessing the correct table
      console.log(uuidMap)
      console.log(foreignTableData)
      const nullRecords: Array<number> = nullRecordCheck(foreignTableData, foreignKeyColumn, foreignIDColumn)
      const multipleIDRecords: Array<number> = mulitpleKeyCheck(foreignTableData, foreignKeyColumn, foreignIDColumn)

      //Corrective Functions - Enable after consulting database and research team. Record deletion is currently done manually if needed.
      // --- mulitpleKeyRemove(foreignTableData, foreignTableName, foreignKeyColumn, foreignIDColumn) ---

      //Once the above checks are completed, deactive the 'Define as array' option for the new UUID columns in Supabase
      //Then run the code below to convert the Airtable Record Strings to the UUID Map.
      /*
      if(nullRecords.length === 0 && multipleIDRecords.length === 0){
        let updateCount: number = 0;
        let uuidReverseMap = new Map<string, string>();

        for (var record of foreignTableData) {
          let uuidUpdateValue: any = uuidMap.get(record[foreignKeyColumn].slice(1,-1))
          if(uuidUpdateValue){
            await updateRecord(foreignTableName, {[foreignKeyColumn]: uuidUpdateValue}, {column: foreignIDColumn, value: record[foreignIDColumn]})
            uuidReverseMap.set(uuidUpdateValue, record[foreignKeyColumn].slice(1,-1))
            updateCount++
          }else{
            console.log(`${record[foreignKeyColumn].slice(1,-1)} + Fail ID ${record[foreignIDColumn]}`)
          }
        }
      console.log(updateCount) //Checks the loop covered the total records in the table
      console.log(uuidReverseMap.size) //Checks the number of unique records
      }
      */
    }

      return {
        createLocalKeyMap,
        updateForeignKeyMap
      }
}


/*
Example Calls in Scipt of Default.vue
  // import { useCartStore } from '@/stores/cartStore'
  // const { updateForeignKeyMap} = useAirtable();
  // const { getCart } = useCartStore();
  // const { updateRecord, getSingleRecord, deleteRecord } = useDatabase();
      
  // updateRecord('Book', {'Book Notes': null}, {column: 'BookID', value: 3})

  // createLocalKeyMap('Female agent','FemaleAgentID','Record Id', 'Female_Agent_uuid')

  // getSingleRecord("Book", {column: 'BookID', value: 3})
  // deleteRecord("Marginal mark", {column: 'MargID', value: 479})
  updateForeignKeyMap("Female agent", "FemaleAgentID", "Record Id", "Female_Agent_uuid", "Marginal mark", "MargID", "Female agent")
*/







/*
FEMALE AGENT ORIGINAL MULTIPLE ID DATA

Original MargIDs of mulitple Female Agent records [33, 34, 35, 38, 49, 57, 76, 166, 256, 528, 612, 642, 643, 1364, 1365, 1414, 1419, 1452, 1596, 1734, 1835, 1839, 1845, 1881]
Original Records below

0
: 
(2) ['recgnUM7UcR6hMFAf', 'rec4lsD0pWe4qIVUh']
1
: 
(2) ['recgnUM7UcR6hMFAf', 'rec4lsD0pWe4qIVUh']
2
: 
(2) ['recgnUM7UcR6hMFAf', 'rec4lsD0pWe4qIVUh']
3
: 
(2) ['recTyqhQ0TBWbuKaF', 'rec69N3H5eY7jqLCj']
4
: 
(2) ['rec9mf6YwubBMntrH', 'reccBrdtqZ9fiqbJF']
5
: 
(2) ['recGfkSugdbRzwEif', 'reckGO4srVWeleTPk']
6
: 
(3) ['recXoak3ZdkuzsADj', 'rec9z8VpmorfRpLqy', 'recDo2RN6qulTyb2W']
7
: 
(2) ['recsFZ6ZF2LHE8R43', 'rec3PSOYsTOSgkDwj']
8
: 
(2) ['recL8vgLZO4OaSjKu', 'recaBGzciunjQAajE']
9
: 
(2) ['recZthUg2PF8PeKzK', 'recAjLff90Y6vWIsn']
10
: 
(3) ['recpV66apiZqzIMnX', 'recKLymcXWJZY3GRA', 'rec7bJORKD5n1U2So']
11
: 
(2) ['recXW8LocJNUhbnys', 'recO6vTN1NBgK6DKZ']
12
: 
(2) ['recXW8LocJNUhbnys', 'recO6vTN1NBgK6DKZ']
13
: 
(2) ['recBrNabRR3R9rBLt', 'recu8fT2psdCr0e8T']
14
: 
(3) ['recBSHqtbsCZ0wTUs', 'recybZ1jJZQoHJ9Nk', 'recruIBL09dDyqL9p']
15
: 
(3) ['recwXO9oVfpCLUHR1', 'recYL8oumO9fbjNNB', 'recKK51heCgbePeti']
16
: 
(2) ['rec4q09DO743MfjJD', 'reckEYNE7dt1QHrQ6']
17
: 
(2) ['recH8PSUpdPANlcdM', 'recDYjxcbMbFmkGfl']
18
: 
(2) ['recYb4jq6gPDAOGx3', 'rec5UkvEKEfZA0KTh']
19
: 
(2) ['recbh0ZR0nhMd8O29', 'rec1SjPQaPWam0U19']
20
: 
(2) ['recGwBwH9Fwc20Kx6', 'recKC4eu9Hyxwicl5']
21
: 
(2) ['recDYjxcbMbFmkGfl', 'recv5FFGiWBPeK58c']
22
: 
(2) ['recDYjxcbMbFmkGfl', 'recv5FFGiWBPeK58c']
23
: 
(2) ['recbh0ZR0nhMd8O29', 'recAfyrBptuky5LhP']
length
: 
24
      */