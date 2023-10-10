<template>
    <div class="library-menu-wrapper">
        <h2 class="menu-title">Select a question to explore the libraries...</h2>
        <div class="menu-page" >
            <div>
            <div class="index-list">
                <h3>Agents</h3>   
                <ul class="library-query">          
                    <li>How many agents are in the collection?</li>                                   
                    <li>What years did each agent make their marks?</li>
                </ul>
            </div>
            <div class="index-list">
            <h3>Books</h3>
                <ul class="library-query">  
                    <li>What kinds of books did people read?</li>
                    <li>How many books did each agent own?</li>
                    <li>What years were the books published?</li>
                </ul>
        </div>
            <div class="index-list">
                <h3>Marks</h3>
                <ul class="library-query">  
                    <li>What types of marks did each agent make?</li>
                    <li>How many marks did each agent make?</li>
                </ul>
            </div>
    </div>
    </div>
    </div>
</template>

<script setup>

</script>

<style lang="scss" scoped>

:root{
    /* COLOURS */
    --footerColour: rgba(30,30,30,1);
    --brandColour: #ed0741FF;
    --black: #1A1A1AFF;
    --lightGrey: #F5F5F5FF;
    --white: #FFFFFFFF;
    --borderGrey: #B3B3B3FF;
    --textGrey: #B9B9B9FF;
    --textBodyBlack: #B9B9B9FF;
    --textMidGrey: #4D4D4DFF;
    --textBlack: #1A1A1AFF;
    --textBodyBlack: #333333FF;

    /* FIXED WIDTHS AND BORDERS */
    --mediaWidth: 600px;
    --sideMargins: clamp(2rem, 6vw, 5rem);
    --borderWidth: 3px;
    --borderWidth-S: 1.75px;
    
  }


.library-menu-wrapper{
    background-color: white;
    margin: 0 10rem 5rem;

}

.menu-title{
    padding: 0;
    margin: 2rem 0 0 0;
	color: rgb(56, 56, 56);
	font-family: 'Source Serif 4', serif;
	font-size: 1rem;
	font-weight:350;
	letter-spacing: 0.2rem;
    color: grey;
}
.menu-page{

    opacity: 100;
    height: 100%;
    width: 100%;
    // overflow: hidden;
    grid-area: index;
    z-index: 1;
    }

  .menu-page>div{
    display: flex;
    flex-flow: row wrap;
    padding: 0;
    width: 100%;
  }

  .index-list{
    flex-grow: 1;
  }


  .index-list h3{
    // padding: 2rem 0 0 0;
    margin: 2rem 0 1rem;
	color: black;
	font-family: 'Source Serif 4', serif;
	font-size: 1.35rem;
	font-weight:350;
	letter-spacing: 0.425rem;;
  }
  
  .index-list>ul{
    margin: 0.5rem 0 0 0;
    font-family: 'Raleway', sans-serif;
	font-size: 0.75rem;
	font-weight: 450;
    letter-spacing: 0.05rem;
    line-height: 1.25rem;
	color: black;
    width: 60%;
  }

  .index-list>ul>li{
    padding: 0.8rem 0;
  }

  .library-query li:hover {background-color: #ebeaea;}
  
</style>