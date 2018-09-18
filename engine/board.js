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
		this.offset = {x: 0, y: 0};
		this.prevOffset = {x: 0, y: 0};
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
		//console.log("update");
	}

	render() {
		for(var i in this.nodeStack){
			this.context.beginPath();

			var obj = this.nodeStack[i].getJSON();
			obj.x += this.offset.x;
			obj.y += this.offset.y;

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
			this.offset = {x: this.prevOffset.x + (this.mouseX - this.down.x), y: this.prevOffset.y + (this.mouseY - this.down.y)};
		}
		else{
			this.prevOffset = this.offset;
		}
	}


	//event listeners
	initEventListeners() {
		document.addEventListener('mousemove', e => {
			
			this.mouseX = e.clientX;
			this.mouseY = e.clientY;

			
			this.calculateOffset();

			this.tick();
		});

		document.addEventListener('mouseup', e => {
			this.clicked = false;
		});

		document.addEventListener('mousedown', e => {
			this.down = {x: e.clientX, y: e.clientY};
			this.clicked = true;
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


