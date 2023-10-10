<template>
    <div class="site-wrapper">
      
    <header class="site-header">
    <NuxtLink to="/">
        <div class="site-header-title-wrapper">
          <h1 class="site-header-title">The Library of Libraries</h1>
          <p class="site-header-subtitle">Early Modern Women's Marginalia</p>
        </div>
    </NuxtLink>
    </header>
      <div class="main-navbar">
            <div class="dropdown" ref="navDropdown" @mouseover="showModal" @mouseleave="hideModal">
            <h2 class="main-navbar-link dropbtn">Explore the Libraries</h2>
                <div class="dropdown-content" ref="navDropdownContent" >
                    <LibraryModal @modalClicked="hideModalClicked" />
                </div>
            </div>
          <NuxtLink to="/your-collection" activeClass="nav-active">
            <div class="dropdown">
                <h2 class="main-navbar-link dropbtn" >View Your Collection</h2>
            </div>   
          </NuxtLink>
          <NuxtLink to="/shared-annotations" activeClass="nav-active">
            <div class="dropdown">
                <h2 class="main-navbar-link dropbtn" >Find Annotations</h2>
            </div>   
          </NuxtLink>
          <NuxtLink to="/about" activeClass="nav-active">
            <div class="dropdown">
                <h2 class="main-navbar-link dropbtn" >Read About the Collection</h2>
            </div>   
          </NuxtLink>
          <NuxtLink to="/site-guide" activeClass="nav-active">
            <div class="dropdown">
                <h2 class="main-navbar-link dropbtn" >Site Guide</h2>
            </div>   
          </NuxtLink>
      </div>
      <div class="library-slot">
        <slot />
      </div>
    </div>
  </template>
  
  <script setup>
  //libraryStore call is placed in this layout file as this will initially update the store state from the database for all pages.
  const libraryStore = useLibraryStore();

  libraryStore.getAgents();
  libraryStore.getBooks();
  libraryStore.getMarks();

  const navDropdown = ref(null)
  const navDropdownContent = ref(null)
         
  const showModal = ()=>{
    navDropdownContent.value.style.transitionDelay = '.1s'
    navDropdownContent.value.style.visibility = 'visible'
  }

  const hideModal = ()=>{
    navDropdownContent.value.style.transitionDelay = '.3s'
    navDropdownContent.value.style.visibility = 'hidden'
  }

  const hideModalClicked = ()=> {
    navDropdownContent.value.style.transitionDelay = '.1s'
    navDropdownContent.value.style.visibility = 'hidden'


}



  </script>
  
  <style scoped>

    .badge{
      position: relative;
      left: -15px;
    }
  </style>