//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));
const connectorbuilder = require(path.join(__dirname, '/connector-builder.js'));
const fraction = require('fractional').Fraction;

var exports = module.exports = {};

// This function create the board to draw the reactangles on 
class Board{
	constructor(){
	
		// -------- Canvas components --------  
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');

		// -------- Mouse components ----------  
		this.mouseX = 1;
		this.mouseY = 1;
		this.nodeStack = [];
		this.connectorStack = [];

		// -------- Zoom and drag state components --------  
		this.zoom = 1;
		this.inverseZoom = 1;
		this.dragState = {
			clicked: false,
			global: true,
			node: null
		};

		// -------- Node and connectors variables --------  
		this.nodeBuilder = nodebuilder.create(this.context);
		this.connectorBuilder = connectorbuilder.create(this.context);

		// -------- Rendered menu variables --------- 
		this.canvasMenuClass = document.getElementsByClassName('canvasMenu');  
		this.canvasMenuSearchResultClass = document.getElementsByClassName('canvasMenuSearchResults'); 

		this.menudiv = document.createElement("div");   
		this.menuComponents = ["function", "loop", "if", "variable", "boolean", "number", "string", "bytes", "object", "null"]; 
		this.searchbar = document.createElement("input");   
		// Filter array when user search for term, so the search results will change and not all menu components will be rendered 
		this.filterArray = new Set(); 
		// Position x and y where the menu will be rendered 
		this.currentMenuPositionX = 0; 
		this.currentMenuPositionY = 0; 

		// Set canvas width and height. 
		this.canvas.width  = document.body.clientWidth;
  		this.canvas.height = document.documentElement.scrollHeight; 
  		this.initEventListeners();
  		this.tick();
	}

	getContext(){
		return this.context;
	}

	addToStack(item){
		this.nodeStack.push(item);
	}

	tick(){
		this.clear();
		this.update();
		this.render();
	}

	getMouse(){
		return {
			x: this.mouseX,
			y: this.mouseY
		};
	}

	update() {
	}

	getInverse(decimal){
		var f = new fraction(decimal);
		return f.denominator/f.numerator;
	}


	globalOrNodeDrag(){
		for(var i in this.nodeStack){
			var loc = this.nodeStack[i].getJSON();

			loc.x = loc.x * this.zoom;
			loc.y = loc.y * this.zoom;
			loc.width = loc.width * this.zoom;
			loc.height = loc.height * this.zoom;

			if(this.mouseX >= loc.x && this.mouseX <= loc.x + loc.width){
				if(this.mouseY >= loc.y && this.mouseY <= loc.y + loc.height){
					this.dragState.node = this.nodeStack[i];
					this.dragState.global = false;
				}
			}
		}
	}

	moveNode(node){
		node.addRelativeXY(this.diffMouse.x * this.inverseZoom, this.diffMouse.y * this.inverseZoom);
	}

	render() {
		if(this.dragState.clicked && !this.dragState.global){
			this.moveNode(this.dragState.node);
		}

		//render mouse dot
		this.context.beginPath();
		this.nodeBuilder.parseJSON({x: this.mouseX, y: this.mouseY, height: 1, width: 1});
		this.context.stroke();

		//connector test
		if(this.nodeStack.length == 2){
			this.context.beginPath();
			var first = this.nodeStack[0].getJSON();
			var second = this.nodeStack[1].getJSON();
			var start = {x: first.x + first.width, y: first.y};
			var end = {x: second.x, y: second.y};
			this.connectorBuilder.makeConnector(start, end);
			this.context.stroke();
		}
		

		for(var i in this.nodeStack){
			this.context.beginPath();

			var obj = this.nodeStack[i].getJSON();

			if(this.dragState.clicked && this.dragState.global){
				this.moveNode(this.nodeStack[i]);
			}
			obj.height = obj.height * this.zoom;
			obj.width = obj.width * this.zoom;
			obj.x = obj.x * this.zoom;
			obj.y = obj.y * this.zoom;

			this.nodeBuilder.parseJSON(obj);
			this.context.stroke();
		}
	}

	clear() {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	// Zooming functions 
	mouseWheelZoom(e){
		var value;
		if(e.deltaY > 0){
			if(this.zoom > 0.5){
				if(this.zoom >= 0){
					this.zoom -= 0.10;
				}else{
					this.zoom -= 0.05;
				}
			}
		}else if(e.deltaY < 0){
			if(this.zoom < 2){
				if(this.zoom <= 0){
					this.zoom += 0.05;
				}else{
					this.zoom += 0.10;
				}
			}
		}
		this.zoom = Math.round(this.zoom * 100) / 100;
		this.inverseZoom = this.getInverse(this.zoom);
	}

	resetDragState(){
		this.dragState = {
			clicked: false,
			global: true,
			node: null
		};
		
	}


	// Draw menu at x and y position where user click on screen  
	// State denotes if menu is already open or currently being search 
		// 1. Initial: user first create a menu 
		// 2. Searching: user already create menu, but currently searching so we don't need to clear the menu 
	renderMenu(state){

		// If user first create the menu by right click mouse. 
		if (state == 'initial'){
			this.clearMenu();  

			// The white box to contain the search bar and results. 
			this.menudiv.className = "canvasMenu";
			this.menudiv.style.position = "absolute"; 
			this.menudiv.style.top = this.currentMenuPositionY + "px"; 
			this.menudiv.style.left = this.currentMenuPositionX + "px"; 
			document.body.appendChild(this.menudiv); 

			// Build the searchbar inside the menu. 
			this.searchbar.className = "canvasMenuSearchBar"; 
			this.searchbar.placeholder = "Search"; 
			this.menudiv.appendChild(this.searchbar);

			// Build the search bar results beneath the search bar. 
			var searchResultsDiv = document.createElement("div");
			searchResultsDiv.className = "canvasMenuSearchResults"; 
			searchResultsDiv.id = 'searchResultsDivID'; 
			this.renderSearchComponents(searchResultsDiv, this.menuComponents); 
			this.menudiv.appendChild(searchResultsDiv);  
		}


		// If user is currently searching, re-rendering the menu 
		else{
			document.getElementById("searchResultsDivID").outerHTML = ""; 
			var searchResultsDiv = document.createElement("div");
			searchResultsDiv.className = "canvasMenuSearchResults"; 
			searchResultsDiv.id = 'searchResultsDivID';  
			this.renderSearchComponents(searchResultsDiv, Array.from(this.filterArray)); 
			this.menudiv.appendChild(searchResultsDiv);  
		}

	}

	// Return array of p tags which are the result 
	// searchresults (type: div): the div which contains the search results components
	// componentArr (type: arr): the list of search terms that will be displayed on the search results 
	renderSearchComponents(searchResultsDiv, componentArr){
		console.log("Backspace should also call this!!!!"); 
		if (componentArr.length == 0)
			componentArr = this.menuComponents; 
		for (var i in componentArr){
			var componentStr = document.createTextNode(componentArr[i]);  
			var componentP = document.createElement("p"); 
			componentP.appendChild(componentStr); 
			searchResultsDiv.appendChild(componentP); 
		}
		console.log("Search results div", searchResultsDiv); 
	}



/* ---------- ALL CLEARING RENDERING FUNCTION WILL GOES DOWN HERE ----------- */ 
	// Erase all previously built menu. 
	clearMenu(){
		try {
			while (this.canvasMenuClass.length > 0) 
				this.canvasMenuClass[0].remove(); 
		} catch(err){
			console.error("Error", err); 
		}
	}



	// This filter the word user is currently searching. 
	filterSearch(word){
		let set = new Set(); 
		if (word){
			for (var i in this.menuComponents){
				var component = this.menuComponents[i]; 
				var inComponent = component.includes(word); 
				if (inComponent == true){
					this.filterArray.add(component); 
				}	
			}
		} else{
			this.filterArray = new Set(); 
		}
		this.renderMenu('searching'); 
		console.log("Filter array", this.filterArray)
	}

	// Event listeners
	initEventListeners() {
		this.canvas.addEventListener('mousemove', e => {
			this.mouseX = e.layerX;  //numbers are static based on side UI
			this.mouseY = e.layerY;
			this.diffMouse = {x: e.movementX, y: e.movementY};
			this.tick();
			//this.globalOrNodeDrag();
		});


		// When user release the mouse 
		this.canvas.addEventListener('mouseup', e => {
			this.resetDragState();

		});


		// When user press down the mouse 
		this.canvas.addEventListener('mousedown', e => {
			this.globalOrNodeDrag();

			// If user left click, erase menu else create menu 
			if (e.button === 0){
				this.clearMenu(); 
			}
			if (e.button === 2 && this.dragState.global == true){
				this.currentMenuPositionX = e.clientX; 
				this.currentMenuPositionY = e.clientY; 
				this.renderMenu('initial'); 
				this.resetDragState(); 
				return; 
			}
			this.dragState.clicked = true;
		});

		this.canvas.addEventListener('wheel', e => {
			//console.log("wheel",e); //foward = -deltaY, backward = +deltaY
			this.mouseWheelZoom(e);
			this.tick();
		});


		// When user removes their hand from the keyboard 
		document.addEventListener('keyup', e => {
			this.filterSearch(this.searchbar.value);   
		});

		document.addEventListener('keydown', e => {

		});

		this.canvas.addEventListener('click', e => {

		});
	}
}



exports.create = function(){
	return new Board();
}


