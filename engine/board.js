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

		this.down = {x: 0, y: 0};
		this.offset = {x: 0, y: 0, z: 1};
		this.prevOffset = {x: 0, y: 0, z: 1};
		this.clicked = false;

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
		this.calculateOffset();
	}

	render() {
		this.context.setTransform(this.offset.z,0,0,this.offset.z,this.offset.x,this.offset.y);
		for(var i in this.nodeStack){
			this.context.beginPath();
			var obj = this.nodeStack[i].getJSON();
			this.nodeBuilder.parseJSON(obj);
			this.context.stroke();
		}
		//console.log("render");
	}

	clear() {
		//console.log("clear");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}

	calculateOffset(){
	if(this.clicked == true){
			this.offset = {
				x: this.prevOffset.x + (this.mouseX - this.down.x), 
				y: this.prevOffset.y + (this.mouseY - this.down.y),
				z: this.offset.z
			};
		}else{
			this.prevOffset = this.offset;
		}
	}

	mouseWheelZoom(e){
		var value;
		if(e.deltaY > 0){
			//console.log("zoom out");
			if(this.offset.z > 0.5){
				if(this.offset.z >= 0){
					this.offset.z -= 0.10;
				}else{
					this.offset.z -= 0.05;
				}
			}
		}else if(e.deltaY < 0){
			//console.log("zoom in");
			if(this.offset.z < 2){
				if(this.offset.z <= 0){
					this.offset.z += 0.05;
				}else{
					this.offset.z += 0.10;
				}
			}
		}
	}

	//event listeners
	initEventListeners() {
		document.addEventListener('mousemove', e => {
			
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;

			this.tick();
		});

		document.addEventListener('mouseup', e => {
			console.log("mouseup",e);
			this.clicked = false;
		});

		document.addEventListener('mousedown', e => {
			console.log("mousedown",e);
			this.down = {x: e.clientX, y: e.clientY};
			this.clicked = true;
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