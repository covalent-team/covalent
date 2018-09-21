//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));

var exports = module.exports = {};
class Board{
	constructor(){
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');

		this.mouseX = 1;
		this.mouseY = 1;
		this.nodeStack = [];

		this.dragState = {
			clicked: false,
			global: true,
			node: null
		};

		this.nodeBuilder = nodebuilder.create(this.context);

		this.canvas.width  = document.body.clientWidth;
  		this.canvas.height = document.documentElement.scrollHeight;///1.618;
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


	globalOrNodeDrag(){
		var canvasMouse = {x: this.mouseX - 270, y: this.mouseY - 50};  //static numbers for canvas offset
		for(var i in this.nodeStack){
			var loc = this.nodeStack[i].getJSON();
			if(canvasMouse.x >= loc.x && canvasMouse.x <= loc.x + loc.width){
				if(canvasMouse.y >= loc.y && canvasMouse.y <= loc.y + loc.height){
					console.log("inside!");
					this.dragState.node = this.nodeStack[i];
					this.dragState.global = false;
				}
			}
		}
	}

	moveNode(node){
		if(this.dragState.clicked == true){
			node.addRelativeXY(this.diffMouse.x, this.diffMouse.y);
		}
	}

	render() {
		if(this.dragState.clicked && !this.dragState.global){
			this.moveNode(this.dragState.node);
		}

		for(var i in this.nodeStack){
			this.context.beginPath();

			var obj = this.nodeStack[i].getJSON();

			if(this.dragState.clicked && this.dragState.global){
				this.nodeStack[i].addRelativeXY(this.diffMouse.x, this.diffMouse.y);
			}
			

			this.nodeBuilder.parseJSON(obj);
			this.context.stroke();
		}
	}

	clear() {
		//console.log("clear");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


	mouseWheelZoom(e){
		// var value;
		// if(e.deltaY > 0){
		// 	//console.log("zoom out");
		// 	if(this.offset.z > 0.5){
		// 		if(this.offset.z >= 0){
		// 			this.offset.z -= 0.10;
		// 		}else{
		// 			this.offset.z -= 0.05;
		// 		}
		// 	}
		// }else if(e.deltaY < 0){
		// 	//console.log("zoom in");
		// 	if(this.offset.z < 2){
		// 		if(this.offset.z <= 0){
		// 			this.offset.z += 0.05;
		// 		}else{
		// 			this.offset.z += 0.10;
		// 		}
		// 	}
		// }
	}

	resetDragState(){
		this.dragState = {
			clicked: false,
			global: true,
			node: null
		};
	}

	//event listeners
	initEventListeners() {
		document.addEventListener('mousemove', e => {
			//console.log("e",e);
			this.mouseX = e.clientX;  //numbers are static based on side UI
			this.mouseY = e.clientY;
			this.diffMouse = {x: e.movementX, y: e.movementY};
			//this.globalOrNodeDrag();
			this.tick();
		});

		document.addEventListener('mouseup', e => {
			console.log("mouseup",e);
			this.resetDragState();
		});

		document.addEventListener('mousedown', e => {
			console.log("mousedown",e);
			this.dragState.clicked = true;
			this.globalOrNodeDrag();
		});

		document.addEventListener('wheel', e => {
			//console.log("wheel",e); //foward = -deltaY, backward = +deltaY
			this.mouseWheelZoom(e);
			this.tick();
		});

		document.addEventListener('keyup', e => {

		});

		document.addEventListener('keydown', e => {

		});

		document.addEventListener('click', e => {

		});
	}
}



exports.create = function(){
	return new Board();
}