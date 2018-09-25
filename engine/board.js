//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));
const connectorbuilder = require(path.join(__dirname, '/connector-builder.js'));
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
		this.connectorStack = [];

		this.zoom = 1;
		this.inverseZoom = 1;

		this.dragState = {
			clicked: false,
			isSocket: false,
			global: true,
			node: null
		};

		this.nodeBuilder = nodebuilder.create(this.context);
		this.connectorBuilder = connectorbuilder.create(this.context);

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
			//var loc = this.nodeStack[i].getJSON();
			var loc = this.nodeBuilder.getHitZones(this.nodeStack[i].getJSON());
			console.log("loc",loc);

			//if argument sockets collision is true
			var j;
			for(j in loc.args){
				if(this.mouseX >= loc.args[j].x-loc.args[j].radius && this.mouseX <= loc.args[j].x+loc.args[j].radius){
					if(this.mouseY >= loc.args[j].y-loc.args[j].radius && this.mouseY <= loc.args[j].y+loc.args[j].radius){
						console.log("inside args");
						this.dragState.node = this.nodeStack[i];
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketLocation = {
							x: loc.args[j].x,
							y: loc.args[j].y
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
						this.dragState.node = this.nodeStack[i];
						this.dragState.global = false;
						this.dragState.isSocket = true;
						this.dragState.socketLocation = {
							x: loc.returns[j].x,
							y: loc.returns[j].y
						};
						return;
					}
				}
			}

			//if leftExec socket collision is true
			if(this.mouseX >= loc.leftExec.x && this.mouseX <= loc.leftExec.x + loc.leftExec.width){
				if(this.mouseY >= loc.leftExec.y && this.mouseY <= loc.leftExec.y + loc.leftExec.height){
					console.log("inside leftExec");
					this.dragState.node = this.nodeStack[i];
					this.dragState.global = false;
					this.dragState.isSocket = true;
					this.dragState.socketLocation = {
							x: loc.leftExec.x + (loc.leftExec.width/2),
							y: loc.leftExec.y + (loc.leftExec.height/2)
						};
					return;
				}
			}

			//if rightExec socket collision is true
			if(this.mouseX >= loc.rightExec.x && this.mouseX <= loc.rightExec.x + loc.rightExec.width){
				if(this.mouseY >= loc.rightExec.y && this.mouseY <= loc.rightExec.y + loc.rightExec.height){
					console.log("inside rightExec");
					this.dragState.node = this.nodeStack[i];
					this.dragState.global = false;
					this.dragState.isSocket = true;
					this.dragState.socketLocation = {
							x: loc.rightExec.x + (loc.rightExec.width/2),
							y: loc.rightExec.y + (loc.rightExec.height/2)
						};
					return;
				}
			}

			if(this.mouseX >= loc.x && this.mouseX <= loc.x + loc.width){
				if(this.mouseY >= loc.y && this.mouseY <= loc.y + loc.height){
					console.log("inside!");
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
		if(this.dragState.clicked && !this.dragState.global && !this.dragState.isSocket){
			this.moveNode(this.dragState.node);
		}
		else if(this.dragState.clicked && !this.dragState.global && this.dragState.isSocket){
			this.context.beginPath();

			var socketLoc = this.dragState.socketLocation;
			var start = {x: socketLoc.x, y: socketLoc.y};
			var end = {x: this.mouseX, y: this.mouseY};
			this.connectorBuilder.makeConnector(start, end);
			this.context.stroke();
		}

		// //render mouse dot
		// this.context.beginPath();
		// this.nodeBuilder.parseJSON({x: this.mouseX, y: this.mouseY, height: 1, width: 1,args:[],returns:[]});
		// this.context.stroke();

		//connector test
		if(this.nodeStack.length == 2){
			this.context.beginPath();
			var first = this.nodeStack[0].getJSON();
			var second = this.nodeStack[1].getJSON();
			var start = {x: (first.x + first.width) * this.zoom, y: first.y * this.zoom};
			var end = {x: second.x * this.zoom, y: second.y * this.zoom};
			this.connectorBuilder.makeConnector(start, end);
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
			isSocket: false,
			node: null
		};
	}

	//event listeners
	initEventListeners() {
		this.canvas.addEventListener('mousemove', e => {
			//console.log("e",e);
			this.mouseX = e.layerX;  //numbers are static based on side UI
			this.mouseY = e.layerY;
			this.diffMouse = {x: e.movementX, y: e.movementY};
			this.tick();
			//this.globalOrNodeDrag();
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


