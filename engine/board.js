//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));
const node = require(path.join(__dirname, '/object.js'));
const connectorbuilder = require(path.join(__dirname, '/connector-builder.js'));
const connector = require(path.join(__dirname, '/connector.js'));
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
			isSocket: false,
			global: true,
			node: null
		};


		// -------- Node and connectors variables --------  

		this.connectionStarted = {
			bool: false,
		};

		this.generateExample();


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

	generateExample(){
		var o1 = {
			x: 1,
			y: 1,
			width: 60,
			height: 60,
			args: 2,
			returns: 2,
			leftExecs: 2,
			rightExecs: 2,
			isPure: false
		};

		var obj1 = node.create(o1);
		this.addToStack(obj1);

		o1.x = 100;
		o1.y = 100;

		var obj2 = node.create(o1);
		this.addToStack(obj2);
	}

	getContext(){
		return this.context;
	}

	addToStack(item){
		var index = this.nodeStack.length;
		item.setNodeIndex(index);
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
			//var loc = this.nodeStack[i].getJSON();
			var loc = this.nodeBuilder.getHitZones(this.nodeStack[i].getJSON());
			console.log("loc",loc);

			//if argument sockets collision is true
			var j;
			for(j in loc.args){
				if(this.mouseX >= loc.args[j].x-loc.args[j].radius && this.mouseX <= loc.args[j].x+loc.args[j].radius){
					if(this.mouseY >= loc.args[j].y-loc.args[j].radius && this.mouseY <= loc.args[j].y+loc.args[j].radius){
						console.log("inside args");
						this.dragState.nodeIndex = i;
						this.dragState.socketType = 'args';
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketIndex = j;
						this.dragState.socketLocation = {
							x: loc.args[j].x,
							y: loc.args[j].y,
							isReversed: true
						};
						return;
					}
				}
			}

			//if return sockets collision is true
			for(j in loc.returns){
				if(this.mouseX >= loc.returns[j].x-loc.returns[j].radius && this.mouseX <= loc.returns[j].x+loc.returns[j].radius){
					if(this.mouseY >= loc.returns[j].y-loc.returns[j].radius && this.mouseY <= loc.returns[j].y+loc.returns[j].radius){
						console.log("inside returns");
						this.dragState.nodeIndex = i;
						this.dragState.socketType = 'returns';
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketIndex = j;
						this.dragState.socketLocation = {
							x: loc.returns[j].x,
							y: loc.returns[j].y,
							isReversed: false
						};
						return;
					}
				}
			}

			//if leftExec socket collision is true
			for(j in loc.leftExec){
				if(this.mouseX >= loc.leftExec[j].x && this.mouseX <= loc.leftExec[j].x + loc.leftExec[j].width){
					if(this.mouseY >= loc.leftExec[j].y && this.mouseY <= loc.leftExec[j].y + loc.leftExec[j].height){
						console.log("inside leftExec");
						this.dragState.nodeIndex = i;
						this.dragState.socketType = 'leftExec';
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketIndex = j;
						this.dragState.socketLocation = {
								x: loc.leftExec[j].x + (loc.leftExec[j].width/2),
								y: loc.leftExec[j].y + (loc.leftExec[j].height/2),
								isReversed: true
							};
						return;
					}
				}
			}

			//if rightExec socket collision is true
			for(j in loc.rightExec){
				if(this.mouseX >= loc.rightExec[j].x && this.mouseX <= loc.rightExec[j].x + loc.rightExec[j].width){
					if(this.mouseY >= loc.rightExec[j].y && this.mouseY <= loc.rightExec[j].y + loc.rightExec[j].height){
						console.log("inside rightExec");
						this.dragState.nodeIndex = i;
						this.dragState.socketType = 'rightExec';
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketIndex = j;
						this.dragState.socketLocation = {
								x: loc.rightExec[j].x + (loc.rightExec[j].width/2),
								y: loc.rightExec[j].y + (loc.rightExec[j].height/2),
								isReversed: false
							};
						return;
					}
				}
			}

			if(this.mouseX >= loc.x && this.mouseX <= loc.x + loc.width){
				if(this.mouseY >= loc.y && this.mouseY <= loc.y + loc.height){
					this.dragState.node = this.nodeStack[i];
					this.dragState.global = false;
					return;
				}
			}
		}
	}

	moveNode(node){
		node.addRelativeXY(this.diffMouse.x * this.inverseZoom, this.diffMouse.y * this.inverseZoom);
	}

	render() {
		//if dragged body of node (not sockets), then drag the node around
		if(this.dragState.clicked && !thiqs.dragState.global && !this.dragState.isSocket){
			this.moveNode(this.dragState.node);
		}

		//if a socket is dragged, spawn connector
		else if(this.dragState.clicked && !this.dragState.global && this.dragState.isSocket){
			this.context.beginPath();
			var socketLoc = this.dragState.socketLocation;
			this.connectionStarted.bool = true;
			this.connectionStarted.info = this.dragState;
			var start = {x: socketLoc.x, y: socketLoc.y};
			var end = {x: this.mouseX, y: this.mouseY};
			this.connectorBuilder.makeConnector(start, end, socketLoc.isReversed);
			this.context.stroke();
		}

		//if button released on a socket, and connector was started, then attach it
		else if(!this.dragState.clicked && !this.dragState.global && this.dragState.isSocket){
			if(this.connectionStarted.bool == true){
				console.log("connected!!", this.connectionStarted);
				var startSoc = this.connectionStarted.info;

				//start and end needs to have {node, socket, }
				

				var start = {
					nodeIndex: startSoc.nodeIndex, 
					socketIndex: startSoc.socketIndex, 
					socketType: startSoc.socketType
				};

				var end = {
					nodeIndex: this.dragState.nodeIndex, 
					socketIndex: this.dragState.socketIndex, 
					socketType: this.dragState.socketType
				};

				//validate if can connect to this socket
				if(start.nodeIndex == end.nodeIndex && start.socketIndex == end.socketIndex){
					console.log("same place, dont");
				}
				else if(start.socketType == end.socketType){
					console.log("both sockets are the same type");
				}
				else if(start.socketType == 'leftExec' && end.socketType != 'rightExec'){
					console.log("execs must be connected to eachother");
				}
				else if(start.socketType == 'rightExec' && end.socketType != 'leftExec'){
					console.log("execs must be connected to eachother");
				}
				else if(start.socketType == 'returns' && end.socketType != 'args'){
					console.log("returns must only connect to args");
				}
				else if(start.socketType == 'args' && end.socketType != 'returns'){
					console.log("returns must only connect to args");
				}

				// //validate args only has one connector going to it
				// else if(start.socketType == 'args' && this.nodeStack[start.nodeIndex].checkArgsConnector(start.socketIndex)){
				// 	console.log("already a connector attached to it");
				// }
				// else if(end.socketType == 'args' && this.nodeStack[end.nodeIndex].checkArgsConnector(end.socketIndex)){
				// 	console.log("already a connector attached to it");
				// }

				//if validated, connect!
				else{
					this.nodeStack[start.nodeIndex].addConnector(start.socketType, start.socketIndex);
					this.nodeStack[end.nodeIndex].addConnector(end.socketType, end.socketIndex);
					var newConnector = connector.create(start, end, startSoc.socketLocation.isReversed);
					this.connectorStack.push(newConnector);
					console.log("connectorStack", this.connectorStack);
				}
				this.connectionStarted.bool = false;
				this.resetDragState();
			}
		}

		for(var i in this.connectorStack){
			var obj = this.connectorStack[i].getJSON();
			var first = this.nodeBuilder.getHitZones(this.nodeStack[obj.start.nodeIndex].getJSON());
			var second = this.nodeBuilder.getHitZones(this.nodeStack[obj.end.nodeIndex].getJSON());


			//args or returns
			if(obj.start.socketType == 'args'){
				var start = {x: first.args[obj.start.socketIndex].x, y: first.args[obj.start.socketIndex].y};
			}
			else if(obj.start.socketType == 'returns'){
				var start = {x: first.returns[obj.start.socketIndex].x, y: first.returns[obj.start.socketIndex].y};
			}
			if(obj.end.socketType == 'args'){
				var end = {x: second.args[obj.end.socketIndex].x, y: second.args[obj.end.socketIndex].y};
			}
			else if(obj.end.socketType == 'returns'){
				var end = {x: second.returns[obj.end.socketIndex].x, y: second.returns[obj.end.socketIndex].y};
			}

			//left and right exec
			if(obj.start.socketType == 'leftExec'){
				var start = {x: first.leftExec[obj.start.socketIndex].x + (first.leftExec[obj.start.socketIndex].width/2), y: first.leftExec[obj.start.socketIndex].y + (first.leftExec[obj.start.socketIndex].height/2)};
			}
			else if(obj.start.socketType == 'rightExec'){
				var start = {x: first.rightExec[obj.start.socketIndex].x + (first.rightExec[obj.start.socketIndex].width/2), y: first.rightExec[obj.start.socketIndex].y + (first.rightExec[obj.start.socketIndex].height/2)};
			}
			if(obj.end.socketType == 'leftExec'){
				var end = {x: second.leftExec[obj.end.socketIndex].x + (second.leftExec[obj.end.socketIndex].width/2), y: second.leftExec[obj.end.socketIndex].y + (second.leftExec[obj.end.socketIndex].height/2)};
			}
			else if(obj.end.socketType == 'rightExec'){
				var end = {x: second.rightExec[obj.end.socketIndex].x + (second.rightExec[obj.end.socketIndex].width/2), y: second.rightExec[obj.end.socketIndex].y + (second.rightExec[obj.end.socketIndex].height/2)};
			}

			this.context.beginPath();
			this.connectorBuilder.makeConnector(start, end, obj.isReversed);
			this.context.stroke();
		}
		

		for(var i in this.nodeStack){
			

			var obj = this.nodeStack[i].getJSON();

			//if clicked on global stuff
			if(this.dragState.clicked && this.dragState.global && !this.dragState.isSocket){
				this.moveNode(this.nodeStack[i]);
			}
			this.nodeBuilder.addZoom(this.zoom);
			this.nodeBuilder.parseJSON(obj);
			
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
		this.render();
	}

	resetDragState(){
		this.dragState = {
			clicked: false,
			global: true,
			isSocket: false,
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
			this.globalOrNodeDrag();

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


