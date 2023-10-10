import{_}from"./nuxt-link.4e587147.js";import{_ as u,o as h,c as v,a as e,b as a,w as n,p,e as b,r as c,Q as g}from"./entry.de7ae5fc.js";import{u as $}from"./libraryStore.8c5c4be6.js";import"./useSupabaseClient.97dbf750.js";const x={},i=s=>(p("data-v-e1bf5960"),s=s(),b(),s),C={class:"library-menu-wrapper"},M=i(()=>e("h2",{class:"menu-title"},"Select a question to explore the libraries...",-1)),S={class:"menu-page"},L={class:"index-list"},D=i(()=>e("h3",null,"Agents",-1)),I={class:"library-query"},B=i(()=>e("li",null,"How many agents are in the collection?",-1)),W=i(()=>e("li",null,"What years did each agent make their marks?",-1)),q=i(()=>e("div",{class:"index-list"},[e("h3",null,"Books"),e("ul",{class:"library-query"},[e("li",null,"What kinds of books did people read?"),e("li",null,"How many books did each agent own?"),e("li",null,"What years were the books published?")])],-1)),A=i(()=>e("div",{class:"index-list"},[e("h3",null,"Marks"),e("ul",{class:"library-query"},[e("li",null,"What types of marks did each agent make?"),e("li",null,"How many marks did each agent make?")])],-1));function N(s,o){const r=_;return h(),v("div",C,[M,e("div",S,[e("div",null,[e("div",L,[D,e("ul",I,[a(r,{to:"/library/agent01",onClick:o[0]||(o[0]=t=>s.$emit("modalClicked"))},{default:n(()=>[B]),_:1}),W])]),q,A])])])}const E=u(x,[["render",N],["__scopeId","data-v-e1bf5960"]]);const l=s=>(p("data-v-13946fb1"),s=s(),b(),s),H={class:"site-wrapper"},V={class:"site-header"},F=l(()=>e("div",{class:"site-header-title-wrapper"},[e("h1",{class:"site-header-title"},"The Library of Libraries"),e("p",{class:"site-header-subtitle"},"Early Modern Women's Marginalia")],-1)),G={class:"main-navbar"},Q=l(()=>e("h2",{class:"main-navbar-link dropbtn"},"Explore the Libraries",-1)),R=l(()=>e("div",{class:"dropdown"},[e("h2",{class:"main-navbar-link dropbtn"},"View Your Collection")],-1)),T=l(()=>e("div",{class:"dropdown"},[e("h2",{class:"main-navbar-link dropbtn"},"Find Annotations")],-1)),Y=l(()=>e("div",{class:"dropdown"},[e("h2",{class:"main-navbar-link dropbtn"},"Read About the Collection")],-1)),j=l(()=>e("div",{class:"dropdown"},[e("h2",{class:"main-navbar-link dropbtn"},"Site Guide")],-1)),z={class:"library-slot"},J={__name:"default",setup(s){const o=$();o.getAgents(),o.getBooks(),o.getMarks();const r=c(null),t=c(null),y=()=>{t.value.style.transitionDelay=".1s",t.value.style.visibility="visible"},m=()=>{t.value.style.transitionDelay=".3s",t.value.style.visibility="hidden"},f=()=>{t.value.style.transitionDelay=".1s",t.value.style.visibility="hidden"};return(k,K)=>{const d=_,w=E;return h(),v("div",H,[e("header",V,[a(d,{to:"/"},{default:n(()=>[F]),_:1})]),e("div",G,[e("div",{class:"dropdown",ref_key:"navDropdown",ref:r,onMouseover:y,onMouseleave:m},[Q,e("div",{class:"dropdown-content",ref_key:"navDropdownContent",ref:t},[a(w,{onModalClicked:f})],512)],544),a(d,{to:"/your-collection",activeClass:"nav-active"},{default:n(()=>[R]),_:1}),a(d,{to:"/shared-annotations",activeClass:"nav-active"},{default:n(()=>[T]),_:1}),a(d,{to:"/about",activeClass:"nav-active"},{default:n(()=>[Y]),_:1}),a(d,{to:"/site-guide",activeClass:"nav-active"},{default:n(()=>[j]),_:1})]),e("div",z,[g(k.$slots,"default",{},void 0,!0)])])}}},Z=u(J,[["__scopeId","data-v-13946fb1"]]);export{Z as default};