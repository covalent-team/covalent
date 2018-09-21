//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));
const fraction = require('fractional').Fraction;

var exports = module.exports = {};
class Board{
	constructor(){
	
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');

		this.mouseX = 1;
		this.mouseY = 1;
		this.nodeStack = [];
		this.zoom = 1;
		this.inverseZoom = 1;

		this.dragState = {
			clicked: false,
			global: true,
			node: null
		};

		this.nodeBuilder = nodebuilder.create(this.context);

		this.canvas.width  = document.body.clientWidth;
  		this.canvas.height = document.documentElement.scrollHeight;//1.618;
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
					console.log("inside!");
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
		//console.log("clear");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


	mouseWheelZoom(e){
		var value;
		if(e.deltaY > 0){
			//console.log("zoom out");
			if(this.zoom > 0.5){
				if(this.zoom >= 0){
					this.zoom -= 0.10;
				}else{
					this.zoom -= 0.05;
				}
			}
		}else if(e.deltaY < 0){
			//console.log("zoom in");
			if(this.zoom < 2){
				if(this.zoom <= 0){
					this.zoom += 0.05;
				}else{
					this.zoom += 0.10;
				}
			}
		}
		this.zoom = Math.round(this.zoom * 100) / 100;
		console.log("this.zoom",this.zoom);
		this.inverseZoom = this.getInverse(this.zoom);
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
		this.canvas.addEventListener('mousemove', e => {
			console.log("e",e);
			this.mouseX = e.layerX;  //numbers are static based on side UI
			this.mouseY = e.layerY;
			this.diffMouse = {x: e.movementX, y: e.movementY};
			this.tick();
			this.globalOrNodeDrag();
		});

		this.canvas.addEventListener('mouseup', e => {
			console.log("mouseup",e);
			this.resetDragState();
		});

		this.canvas.addEventListener('mousedown', e => {
			console.log("mousedown",e);
			this.dragState.clicked = true;
			this.globalOrNodeDrag();
		});

		this.canvas.addEventListener('wheel', e => {
			//console.log("wheel",e); //foward = -deltaY, backward = +deltaY
			this.mouseWheelZoom(e);
			this.tick();
		});

		document.addEventListener('keyup', e => {

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


