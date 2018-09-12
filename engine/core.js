// //engine core
// var exports = module.exports = {};
// // var ipc = require('electron').ipcMain;

// class Board{
// 	constructor(){

// 		// ipc.on('renderInit', function(event, data){
// 		// 	event.sender.send('createCanvas');
// 		// });

// 		// ipc.on('canvasCreated', function(event, data){
// 		// 	this.context = data.context;
// 		// 	console.log("this.context", this.context);
// 		// });
// 		this.canvas = document.createElement('canvas');
// 		document.body.appendChild(this.canvas);
// 		this.context = this.canvas.getContext('2d');

// 		this.canvas.width  = document.body.clientWidth;
//   		this.canvas.height = document.documentElement.scrollHeight/1.618;
//   		this.initEventListeners();
// 		console.log("init complete");
// 		this.drawArray = [];
// 		this.DraggingState = {
// 			isState: false,
// 			isGlobal: false,
// 			isCtrlHeld: false,
// 			diffX: 0,
// 			diffY: 0
// 		};
// 	}

// 	getContext(){
// 		return this.context;
// 	}

// 	addToStack(item){
// 		this.drawArray.push(item);
// 	}

// 	tick() {
// 		this.clear();
// 		this.update();
// 		this.render();
// 	}

// 	update() {
// 		//console.log("update");
// 		for(var i in this.drawArray){
// 			this.drawArray[i].update();
// 		}
// 	}

// 	render() {
// 		for(var i in this.drawArray){
// 			this.drawArray[i].draw(this.context, this.canvas);
// 			this.context.stroke();
// 		}
// 	}
// ;
// 	clear() {
// 		//console.log("clear");
// 		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
// 	}


// 	//event listeners
// 	initEventListeners() {
// 		console.log("foobar");
// 		document.addEventListener('mousemove', (e) => {
// 			this.mouseX = e.clientX;
// 			this.mouseY = e.clientY;
// 			// console.log(this.mouseX, this.mouseY);
// 			// console.log("e", e);
// 			this.tick();

// 			if(this.DraggingState.isState){
// 				if(!this.DraggingState.isGlobal){
// 					this.selectedNode.setX(this.mouseX - this.DraggingState.diffX);
// 					this.selectedNode.setY(this.mouseY - this.DraggingState.diffY);
// 				}

// 				//global canvas related drags
// 				if(this.DraggingState.isGlobal){

// 					//Only Global Drag
// 					if(!this.DraggingState.isCtrlHeld){
// 						for(var i in this.drawArray){
// 							var loc = this.drawArray[i].getLocData();
// 							this.drawArray[i].setX(loc.x + e.movementX);
// 							this.drawArray[i].setY(loc.y + e.movementY);
// 						}
// 					}

// 					//CTRL key is held while dragging
// 					if(this.DraggingState.isCtrlHeld){

// 					}
// 				}
// 			}

// 		});

// 		document.addEventListener('click', (e) => {
// 			console.log("clickker");
// 		});

// 		document.addEventListener('mousedown', (e) => {
// 			console.log("mousedown", e);

// 			//find a better, more functional way to handle this
// 			for(var i in this.drawArray){
// 				var loc = this.drawArray[i].getLocData();
// 				if(this.mouseX >= loc.x && this.mouseX <= loc.x + loc.w){
// 					console.log("width is there!");
// 					if(this.mouseY >= loc.y && this.mouseY <= loc.y + loc.h){
// 						console.log("height is there");
// 						this.selectedNode = this.drawArray[i];
// 						this.selectedNode.changeColor('red');

// 						//get relative diff
// 						var diffX = this.mouseX - loc.x;
// 						var diffY = this.mouseY - loc.y;

// 						this.DraggingState = {
// 							isState: true,
// 							isGlobal: false,
// 							diffX: diffX,
// 							diffY: diffY
// 						};
// 						return;
// 					}
// 				}
// 			}

// 			//assume no nodes are clicked
// 			console.log("no nodes");
// 			this.DraggingState.isState = true;
// 			this.DraggingState.isGlobal = true;
// 		});

// 		document.addEventListener('mouseup', (e) => {
// 			console.log("mouseup", e);
// 			try{
// 				this.selectedNode.changeColor('blue');
// 			}
// 			catch(err){
// 				console.log("err");
// 			}
			
// 			this.DraggingState.isState = false;
// 			this.DraggingState.isGlobal = false;
// 		});

// 		document.addEventListener('keydown', (e) => {

// 		});

// 		document.addEventListener('keyup', (e) => {
			
// 		});
// 	}
// }

// exports.create = function(){
// 	return new Board();
// }