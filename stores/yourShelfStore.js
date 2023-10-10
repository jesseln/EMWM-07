export const useYourShelfStore = defineStore('yourShelf', ()=>{

    const yourShelf = ref([]) 

    async function addToShelf(item) {
        let id; 
        if(item['FemaleAgentID']) id = 'FemaleAgentID'
        if(item['BookID']) id = 'BookID'
        if(item['MargID']) id = 'MargID'

        const exists = yourShelf.value.find(i => i[id] === item[id]) 

        if(exists) {
            alert('Item already on shelf') //Placeholder for modal option
        }
        if(!exists) {
            yourShelf.value.push({...item}) 
        }
      }

      async function removeFromShelf(item) {
        let id; 
        if(item['FemaleAgentID']) id = 'FemaleAgentID'
        if(item['BookID']) id = 'BookID'
        if(item['MargID']) id = 'MargID'

        yourShelf.value = yourShelf.value.filter(d => d[id] !== item[id])
      }

      return {yourShelf, addToShelf, removeFromShelf}
  })