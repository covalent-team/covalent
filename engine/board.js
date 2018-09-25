//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));
const connectorbuilder = require(path.join(__dirname, '/connector-builder.js'));
const connector = require(path.join(__dirname, '/connector.js'));
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

		this.connectionStarted = {
			bool: false,
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
			if(this.mouseX >= loc.leftExec.x && this.mouseX <= loc.leftExec.x + loc.leftExec.width){
				if(this.mouseY >= loc.leftExec.y && this.mouseY <= loc.leftExec.y + loc.leftExec.height){
					console.log("inside leftExec");
					this.dragState.nodeIndex = i;
					this.dragState.socketType = 'leftExec';
					this.dragState.global = false;
					this.dragState.isSocket = true;
					this.dragState.socketLocation = {
							x: loc.leftExec.x + (loc.leftExec.width/2),
							y: loc.leftExec.y + (loc.leftExec.height/2),
							isReversed: true
						};
					return;
				}
			}

			//if rightExec socket collision is true
			if(this.mouseX >= loc.rightExec.x && this.mouseX <= loc.rightExec.x + loc.rightExec.width){
				if(this.mouseY >= loc.rightExec.y && this.mouseY <= loc.rightExec.y + loc.rightExec.height){
					console.log("inside rightExec");
					this.dragState.nodeIndex = i;
					this.dragState.socketType = 'rightExec';
					this.dragState.global = false;
					this.dragState.isSocket = true;
					this.dragState.socketLocation = {
							x: loc.rightExec.x + (loc.rightExec.width/2),
							y: loc.rightExec.y + (loc.rightExec.height/2),
							isReversed: false
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
				

				var start = {nodeIndex: startSoc.nodeIndex, socketIndex: startSoc.socketIndex, socketType: startSoc.socketType};
				var end = {nodeIndex: this.dragState.nodeIndex, socketIndex: this.dragState.socketIndex, socketType: this.dragState.socketType};

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



				//if validated, connect!
				else{
					var newConnector = connector.create(start, end, startSoc.socketLocation.isReversed);
					this.connectorStack.push(newConnector);
					console.log("connectorStack", this.connectorStack);
				}
				this.connectionStarted.bool = false;
				this.resetDragState();
			}
		}

		//connector test
		// if(this.nodeStack.length == 2){
		// 	this.context.beginPath();
		// 	var first = this.nodeStack[0].getJSON();
		// 	var second = this.nodeStack[1].getJSON();
		// 	var start = {x: (first.x + first.width) * this.zoom, y: first.y * this.zoom};
		// 	var end = {x: second.x * this.zoom, y: second.y * this.zoom};
		// 	this.connectorBuilder.makeConnector(start, end);
		// 	this.context.stroke();
		// }

		for(var i in this.connectorStack){
			var obj = this.connectorStack[i].getJSON();
			var first = this.nodeBuilder.getHitZones(this.nodeStack[obj.start.nodeIndex].getJSON());
			var second = this.nodeBuilder.getHitZones(this.nodeStack[obj.end.nodeIndex].getJSON());

			console.log("first",first);
			console.log("second",second);
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

			//leftExecs
			if(obj.start.socketType == 'leftExec'){
				var start = {x: first.leftExec.x + (first.leftExec.width/2), y: first.leftExec.y + (first.leftExec.height/2)};
			}
			else if(obj.end.socketType == 'leftExec'){
				var end = {x: second.leftExec.x + (second.leftExec.width/2), y: second.leftExec.y + (second.leftExec.height/2)};
			}

			//rightExec
			if(obj.start.socketType == 'rightExec'){
				var start = {x: first.rightExec.x + (first.rightExec.width/2), y: first.rightExec.y + (first.rightExec.height/2)};
			}
			else if(obj.end.socketType == 'rightExec'){
				var end = {x: second.rightExec.x + (second.rightExec.width/2), y: second.rightExec.y + (second.rightExec.height/2)};
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
			this.globalOrNodeDrag();
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


