import{K as S,r as i}from"./entry.de7ae5fc.js";import{u as T}from"./useSupabaseClient.97dbf750.js";const v=()=>{const r=T();async function g(t,n){let e=await l(t)||0,a=await c(t,n,0,999);for(;e>a.length;)await c(t,n,a.length,a.length+1e3).then(o=>{a.push(...o)});return a}async function f(t,n){let e=await l(t)||0,a=await w(t,n,0,999);for(;e>a.length;)await c(t,n,a.length,a.length+1e3).then(o=>{a.push(...o)});return a}async function d(t,n){const{data:e,error:a}=await r.from(t).select().eq(n.column,n.value).maybeSingle();if(a&&console.log(a),e)return e}async function c(t,n,e,a){const o=y(t),{data:u,count:p,error:s}=await r.from(t).select(o,{count:"exact"}).order(n,{ascending:!0}).range(e,a);if(s&&console.log(s),u)return u}async function w(t,n,e,a){const o=y(t),{data:u,count:p,error:s}=await r.from(t).select(o,{count:"exact"}).order(n,{ascending:!0}).range(e,a);if(s&&console.log(s),u)return u}async function l(t){const{data:n,count:e,error:a}=await r.from(t).select("*",{count:"exact",head:!0});if(a&&console.log(a),e)return e}async function b(t,n,e){const{data:a,error:o}=await r.from(t).update(n).eq(e.column,e.value).select();if(o&&console.log(o),a)return a}async function h(t,n){const{error:e}=await r.from(t).delete().eq(n.column,n.value);e&&console.log(e)}async function k(t,n,e,a,o){const u=await g(t,n);let p=0,s=0;for(var m of u){let D=o(m[e]);D?(console.log(`Pos ID ${m} + updateValue ${D}`),p++):(console.log(`Non-Zero Fail ID ${m} + updateValue ${D}`),s++)}console.log(p,s)}function y(t){return t==="Agents"?"*, Marks(*, Books(*))":t==="Books"?"*, Marks(*, Agents(*))":t==="Marks"?"*, Agents(*), Books(*)":"*"}return{getTable:g,getTableTest:f,updateCalulatedColumn:k,getSingleRecord:d,getPaginatedData:c,getTableCount:l,updateRecord:b,deleteRecord:h}},B=S("library",()=>{const{getTable:r,getTableTest:g}=v(),f=i([]),d=i([]),c=i([]),w=i([]),l=i([]);async function b(n,e){f.value=await r(n,e)}async function h(){d.value=await r("Agents","FemaleAgentID")}async function k(){c.value=await r("Books","BookID")}async function y(){w.value=await r("Marks","MargID")}async function t(n,e){l.value=await g(n,e)}return{items:f,Agent:d,Book:c,Mark:w,getItems:b,getAgents:h,getBooks:k,getMarks:y,getLibraryItemsTest:t}});export{B as u};
