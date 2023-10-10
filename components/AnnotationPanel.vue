<template>
<div id="draw">
	<div class="welcome-bg" v-if="popups.showWelcome">
		<div class="welcome">
			<h1 class="fade-up">Annotate the Library</h1>
			<h2 class="fade-up">
				Create annotations using the draw toolbar
			</h2>
			<a href="//twitter.com/lewitje" target="blank" title="Lewi Hussey on Twitter" class="fade-up">@emw_marginalia</a>
			<span class="btn fade-up"
						title="Close"
						v-on:click="popups.showWelcome = false">
				Click here to be begin
			</span>
		</div>
	</div>
	<div class="app-wrapper" >
		<canvas id="canvas" ref="container">
		</canvas>
		<div class="cursor" id="cursor"></div>
		<div class="controls">
			<div class="btn-row">
				<div class="history" title="history">
					{{ history.length }}
				</div>
			</div>
			<div class="btn-row">
				<button type="button"
								v-on:click="removeHistoryItem"
								v-bind:class="{ disabled: !history.length }" title="Undo">
					<i class="ion ion-reply"></i>
				</button>
				<button type="button"
								v-on:click="removeAllHistory"
								v-bind:class="{ disabled: !history.length }" title="Clear all">
					<i class="ion ion-trash-a"></i>
				</button>
			</div>
			
			<div class="btn-row">
				<button title="Brush options"
								v-on:click="popups.showOptions = !popups.showOptions">
					<i class="ion ion-android-create"></i>
				</button>
				
				<div class="popup" v-if="popups.showOptions">
					<div class="popup-title">
						Options
					</div>
					<button title="Restrict movement vertical"
									v-on:click="options.restrictY = !options.restrictY; options.restrictX = false"
									v-bind:class="{ active: options.restrictY }"
									>
						<i class="ion ion-arrow-right-c"></i>
						Restrict vertical
					</button>
					<button title="Restrict movement horizontal"
									v-on:click="options.restrictX = !options.restrictX; options.restrictY = false"
									v-bind:class="{ active: options.restrictX }"
									>
						<i class="ion ion-arrow-up-c"></i>
						Restrict horizontal
					</button>
					<button type="button"
								v-on:click="simplify"
								v-bind:class="{ disabled: !history.length }" title="Simplify paths">
						<i class="ion ion-wand"></i>
						Simplify paths
					</button>
					<button type="button"
									v-on:click="jumble"
									v-bind:class="{ disabled: !history.length }" title="Go nutz">
						<i class="ion ion-shuffle"></i>
						Go nutz
					</button>
				</div>
				
			</div>

			<div class="btn-row">
				<button title="Pick a brush size"
								v-on:click="popups.showSize = !popups.showSize"
								v-bind:class="{ active: popups.showSize }">
					<i class="ion ion-android-radio-button-on"></i>
					<span class="size-icon">
						{{ size }}
					</span>
				</button>
				
				<div class="popup" v-if="popups.showSize">
					<div class="popup-title">
						Brush size
					</div>
					<label v-for="sizeItem in sizes" class="size-item">
						<input type="radio" name="size" v-model="size" v-bind:value="sizeItem">
						<span class="size"
									v-bind:style="{width: sizeItem + 'px', height: sizeItem + 'px'}"
									></span>
					</label>
				</div>
			</div>
			
			<div class="btn-row">
				<button title="Pick a color"
								v-on:click="popups.showColor = !popups.showColor"
								v-bind:class="{ active: popups.showColor }">
					<i class="ion ion-android-color-palette"></i>
					<span class="color-icon"
								v-bind:style="{backgroundColor: color}">
					</span>
				</button>
				
				<div class="popup" v-if="popups.showColor">
					<div class="popup-title">
						Brush color
					</div>
					<label v-for="colorItem in colors" class="color-item" >
						<input type="radio"
									 name="color"
									 v-model="color"
									 v-bind:value="colorItem"
                                     >
						<span v-bind:class="'color color-' + colorItem"
									v-bind:style="{backgroundColor: colorItem}"
									></span>
					</label>
				</div>
			</div>
			
			<div class="btn-row">
				<button title="Save"
								v-on:click="popups.showSave = !popups.showSave">
					<i class="ion ion-android-cloud-outline"></i>
				</button>
				
				<div class="popup" v-if="popups.showSave">
					<div class="popup-title">
						Save your design
					</div>
					<div class="form">
						<input type="text"
									 placeholder="Save name"
									 v-model="save.name">
						<div v-if="save.name.length < 3" class="text-faded">
							<i>
								Min 3 characters
							</i>
						</div>
						<span class="btn"
									v-on:click="saveItem">
							Save as
							<span class="text-faded"> 
								{{ save.name }}
							</span>
						</span>
					</div>
					
					<div class="saves" v-if="save.saveItems.length">
						<div class="popup-title">
							Load a save
						</div>

						<div class="save-item"
								 v-for="item in save.saveItems">
							<h3>{{ item.name }}</h3>
							<span class="btn"
										v-on:click="loadSave(item)">load</span>
						</div>
					</div>
				</div>
				
			</div>
			
			<div class="btn-row">
				<button v-on:click="popups.showWelcome = true" title="Made by Lewi">
					<i class="ion ion-heart"></i>
				</button>
			</div>
		</div>
	</div>
</div>
</template>

<script setup>
    const container = ref(null)

    const { width, height } = useElementSize(container)
    const useWidth = width
    const useHeight = height


  const { x, y, sourceType } = useMouse()
  const { pressed } = useMousePressed()
  const useX = x
  const useY = y
  const usePressed = pressed

  let el = '#draw'
    const history = ref([])
	const color =  ref('#fff281')
	const popups = ref({
			showColor: false,
			showSize: false,
			showWelcome: true,
			showSave: false,
			showOptions: false
		})
    const options = ref({
			restrictY: false,
			restrictX: false
		})
	const save = ref({
			name: '',
			saveItems: []
		})
    const size = ref(6)
    const colors = ref([
			'#d4f713',
			'#13f7ab',
			'#13f3f7',
			'#13c5f7',
			'#138cf7',
			'#1353f7',
			'#2d13f7',
			'#7513f7',
			'#a713f7',
			'#d413f7',
			'#f713e0',
			'#f71397',
			'#f7135b',
			'#f71313',
			'#f76213',
			'#f79413',
			'#fff281'])
    const sizes = ref([6, 12, 24, 48])
    let weights = [ 2, 4, 6 ]

    const removeHistoryItem = ()=>{
			history.value.splice(history.value.length-2, 1);
			redraw();
    }
    const removeAllHistory = ()=>{
			history.value = [];
			redraw();
    }
    const simplify = ()=>{
			let simpleHistory = [];
			history.value.forEach((item, i)=>{
				if(i % 6 !== 1 || item.isDummy){
					simpleHistory.push(item);
				}
			});
			history.value = simpleHistory;
			redraw();
    }
    const jumble = ()=>{
			let simpleHistory = [];
			history.value.forEach((item, i)=>{
				item.r += Math.sin(i * 20) * 5;
			});
			history.value = shuffle(history.value);
			redraw();
    }
    const shuffle = (a)=>{
			let b = [];
			
			a.forEach((item, i)=>{
				if(!item.isDummy){
					let l = b.length;
					let r = Math.floor(l * Math.random());
					b.splice(r, 0, item);
				}
			});
			
			for(let i = 0; i < b.length; i++){
				if(i % 20 === 1){
					b.push(getDummyItem());	
				}
			}
			
			return b;
    }
    const saveItem = ()=>{
			if(save.value.name.length > 2){
				let historyItem = {
					history: history.value.slice(),
					name: save.value.name
				};

				save.value.saveItems.push(historyItem);
				save.value.name = "";
			}
    }
    const loadSave = (item)=>{
			history.value = item.history.slice();
        redraw();
		}


    let c;
    let ctx;
    let mouseDown = false;
    let mouseX= 0;
    let mouseY= 0;
    let tempHistory= [];

function mousePressed(){
    if(!usePressed.value && mouseDown) {
        setDummyPoint()
        mouseDown = false
    }else if(usePressed.value && !mouseDown){
        mouseDown = true
    }
}

 function mouseDrag(){
    let cursor = document.getElementById('cursor');
    cursor.style.transform = `translate(${useX.value -10}px, ${useY.value - 10}px)`;
    
        if(mouseDown){

            mouseX = mouseX;
            mouseY = mouseY;
        
            if(!options.value.restrictX){
                mouseX = useX.value;
            }
            
            if(!options.value.restrictY){
                mouseY = useY.value;
            }
                            
            let item = {
                isDummy: false,
                x: mouseX,
                y: mouseY,
                c: color.value,
                r: size.value
            };
            
            history.value.push(item);
            draw(item, history.value.length);
        }
    }
function setSize(){
        c.width = useWidth.value;
        c.height = useHeight.value;
    }
function getDummyItem(){
		let lastPoint = history.value[history.value.length-1];
		
		return {
			isDummy: true,
			x: lastPoint?.x? lastPoint.x:  useX.value,
			y: lastPoint?.y? lastPoint.y:  useY.value,
			c: null,
			r: null
		};
	}
function setDummyPoint(){
		let item = getDummyItem();
		history.value.push(item);
		draw(item, history.value.length);
	}
function redraw(){
		ctx.clearRect(0, 0, c.width, c.height);
		drawBgDots();
		
		if(!history.value.length){
			return true;
		}
		
		history.value.forEach((item, i)=>{
			draw(item, i);
		});
	}
function drawBgDots(){
		let gridSize = 50;
		ctx.fillStyle = 'rgba(0, 0, 0, .2)';
		
		for(let i = 0; i*gridSize < c.width; i++){
			for(let j = 0; j*gridSize < c.height; j++){
				if(i > 0 && j > 0){
					ctx.beginPath();
					ctx.rect(i * gridSize, j * gridSize, 2, 2);
					ctx.fill();
				}
			}
		}
	}
function draw(item, i){
		ctx.lineCap = 'round';
		ctx.lineJoin="round";
        ctx.strokeStyle = item.c;
        ctx.lineWidth = item.r;
		let prevItem = history.value[i-2];
				
		if(i < 2){
			return false;
		}

		if(!item.isDummy && !history.value[i-1].isDummy && !prevItem.isDummy){
			ctx.beginPath();
			ctx.moveTo(prevItem.x, prevItem.y);
			ctx.lineTo(item.x, item.y);
			ctx.stroke();
		} 
        else if (!item.isDummy ) {			
			// ctx.beginPath();
			// ctx.moveTo(item.x, item.y);
			// ctx.lineTo(item.x, item.y);
			// ctx.stroke();
		}
	}

onMounted(()=>{
    c = document.getElementById('canvas');
    ctx = document.getElementById('canvas').getContext('2d');

    watchEffect(()=>{
        mouseDrag()
        mousePressed()

    })

    watch([useWidth, useHeight], ()=>{
        setSize();
        redraw();
    }, { immediate: true })    
    
})

</script>

<style lang="scss" scoped>
.cursor {
    position: absolute;
    top: 0;
    left: 0;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    border: 3px solid #1e1e1e;
    pointer-events: none;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
    mix-blend-mode: difference;
    opacity: 0;
    transition: opacity 1s;
  }
  
  canvas {
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: transparent;
    cursor: none;
    position: absolute;
  }
  
  canvas:hover + .cursor {
    opacity: 1;
  }
  canvas:active + .cursor {
    border-color: #3c3c3c;
  }
  
  .controls {
    position: fixed;
    z-index: 5;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: #0a0a0a;
    display: flex;
    justify-content: center;
    align-items: center;
    -webkit-user-select: none;
       -moz-user-select: none;
        -ms-user-select: none;
            user-select: none;
  }
  
  .stat {
    font-size: 20px;
    margin-bottom: 15px;
  }
  
  .btn-row {
    position: relative;
    margin-bottom: 5px;
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    padding: 0 15px;
    border-radius: 4px;
  }
  
  .popup {
    position: absolute;
    width: 300px;
    bottom: 58px;
    padding: 30px;
    left: calc(50% - 150px);
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    background-color: white;
    color: #1e1e1e;
    border-radius: 10px 10px 0 0;
    border: 1px solid gainsboro;
    border-bottom-width: 0;
    opacity: 0;
    -webkit-animation: popup 0.5s forwards cubic-bezier(0.2, 2, 0.4, 1);
            animation: popup 0.5s forwards cubic-bezier(0.2, 2, 0.4, 1);
    z-index: 2;
    overflow: hidden;
    max-height: 80vh;
    overflow-y: auto;
  }
  .popup .popup-title {
    flex: 0 0 100%;
    text-align: center;
    font-size: 16px;
    color: black;
    opacity: 0.5;
    margin-bottom: 10px;
  }
  .popup button {
    height: 80px;
    width: 80px;
    text-align: center;
    font-size: 14px;
    color: rgba(0, 0, 0, 0.4);
  }
  .popup button i {
    display: block;
    font-size: 30px;
    margin-bottom: 5px;
    color: rgba(0, 0, 0, 0.2);
  }
  .popup button.disabled {
    color: rgba(0, 0, 0, 0.2);
  }
  .popup button.disabled i {
    color: rgba(0, 0, 0, 0.1);
  }
  .popup button.active, .popup button:active {
    color: rgba(0, 0, 0, 0.4);
  }
  .popup button.active i, .popup button:active i {
    color: #0095ff;
  }
  
  @-webkit-keyframes popup {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  
  @keyframes popup {
    from {
      opacity: 0;
      transform: translateX(40px);
    }
    to {
      opacity: 1;
      transform: none;
    }
  }
  .welcome-bg {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 100%;
    z-index: 9;
    background-color: #fff281;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .fade-up {
    opacity: 0;
    -webkit-animation: fade-up 1s forwards cubic-bezier(0.2, 2, 0.4, 1);
            animation: fade-up 1s forwards cubic-bezier(0.2, 2, 0.4, 1);
  }
  
  .btn {
    display: inline-block;
    margin-top: 10px;
    padding: 10px 20px;
    font-weight: 400;
    font-size: 16px;
    border-radius: 4px;
    background-color: #0095ff;
    color: white;
    -webkit-animation-delay: 1s;
            animation-delay: 1s;
    transition: all 0.15s;
    cursor: pointer;
  }
  .btn:hover {
    background-color: #33aaff;
  }
  
  .welcome {
    width: 50vw;
    height: 50vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  .welcome h1.fade-up {
    margin: 5px 10px;
	color: black;
	font-family: 'Source Serif 4', serif;
	font-size: 2.2rem;
	font-weight:200;
	letter-spacing: 0.1rem;
    -webkit-animation-delay: 0.25s;
            animation-delay: 0.25s;
  }
  .welcome h2.fade-up {
	font-family: 'Raleway', sans-serif;
	font-size: 1.1rem;
    font-weight: 350;
    color: rgb(66, 66, 66);
    -webkit-animation-delay: 0.5s;
            animation-delay: 0.5s;
  }
  .welcome a.fade-up {
    font-family: 'Raleway', sans-serif;
	font-size: 0.8rem;
    font-weight: 350;
    color: rgb(66, 66, 66);
    display: inline-block;
    margin-top: 20px;
    text-decoration: none;
    -webkit-animation-delay: 0.75s;
            animation-delay: 0.75s;
  }
  .welcome .btn.fade-up {
    font-family: 'Raleway', sans-serif;
	font-size: 0.8rem;
    font-weight: 450;
    background-color: rgba(255, 255, 255, 0.418);
    color: rgb(66, 66, 66);
    margin-top: 60px;
  }
  .welcome .btn.fade-up:hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  @-webkit-keyframes fade-up {
    from {
      transform: translateY(80px);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
  
  @keyframes fade-up {
    from {
      transform: translateY(80px);
      opacity: 0;
    }
    to {
      transform: none;
      opacity: 1;
    }
  }
  .form {
    flex: 0 0 100%;
  }
  .form input {
    display: block;
    -webkit-appearance: none;
       -moz-appearance: none;
            appearance: none;
    border: 0;
    box-shadow: 0;
    outline: 0;
    background-color: #f0f0f0;
    border-radius: 4px;
    padding: 10px 15px;
    width: 100%;
    margin-bottom: 4px;
  }
  
  button {
    -webkit-appearance: none;
       -moz-appearance: none;
            appearance: none;
    border: 0;
    border-radius: 0;
    box-shadow: 0;
    width: 40px;
    height: 60px;
    display: inline-block;
    background-color: transparent;
    color: #8c8c8c;
    font-size: 22px;
    transition: all 0.15s;
    cursor: pointer;
    outline: 0;
    position: relative;
  }
  button .size-icon,
  button .color-icon {
    position: absolute;
    top: 10px;
    right: 0;
  }
  button .color-icon {
    width: 5px;
    height: 5px;
    border-radius: 50%;
  }
  button .size-icon {
    font-size: 6px;
    text-align: right;
  }
  button:hover {
    opacity: 0.8;
  }
  button:active, button.active {
    color: white;
  }
  button.disabled {
    color: #323232;
    cursor: not-allowed;
  }
  
  .history {
    width: 30px;
    height: 30px;
    background-color: #1e1e1e;
    border-radius: 50%;
    text-align: center;
    line-height: 30px;
    font-size: 12px;
    overflow: hidden;
    color: #8c8c8c;
  }
  
  .color-item {
    position: relative;
    display: inline-block;
    cursor: pointer;
    width: 60px;
    height: 60px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .color-item input {
    position: absolute;
    opacity: 0;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
  }
  .color-item input:checked + .color {
    opacity: 1;
    border: 2px solid #0095ff;
  }
  .color-item .color {
    display: block;
    width: 30px;
    height: 30px;
    background-color: white;
    border-radius: 50%;
  }
  .color-item .color:hover {
    opacity: 0.8;
  }
  
  @-webkit-keyframes pulsate {
    0%, 100% {
      transform: none;
    }
    50% {
      transform: scale(1.15);
    }
  }
  
  @keyframes pulsate {
    0%, 100% {
      transform: none;
    }
    50% {
      transform: scale(1.15);
    }
  }
  .size-item {
    width: 40px;
    height: 60px;
    display: inline-flex;
    position: relative;
    justify-content: center;
    align-items: center;
    vertical-align: top;
    cursor: pointer;
  }
  .size-item input {
    position: absolute;
    top: 0;
    left: 0;
    width: 0;
    height: 0;
    opacity: 0;
  }
  .size-item .size {
    background-color: #8c8c8c;
    display: inline-block;
    border-radius: 50%;
    transition: all 0.15s;
    transform: translate(-50%, -50%) scale(0.6);
    position: absolute;
    top: 50%;
    left: 50%;
  }
  .size-item .size:hover {
    opacity: 0.8;
  }
  .size-item input:checked + .size {
    background-color: #0095ff;
  }
  
  .saves {
    flex: 0 0 calc(100% + 60px);
    margin: 30px -30px -30px;
    padding: 30px;
    background-color: #f0f0f0;
    max-height: 250px;
    overflow-y: auto;
  }
  .saves .save-item {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
</style>