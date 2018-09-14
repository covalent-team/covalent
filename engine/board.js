//engine core
const path = require('path');
const nodebuilder = require(path.join(__dirname, '/node-builder.js'));

var exports = module.exports = {};
class Board{
	constructor(){
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');

		this.nodeBuilder = nodebuilder.create(this.context);

		this.canvas.width  = document.body.clientWidth;
  		this.canvas.height = document.documentElement.scrollHeight/1.618;
  		this.initEventListeners();
  		this.tick();
	}

	getContext(){
		return this.context;
	}

	addToStack(item){
	}

	tick(){
		this.clear();
		this.update();
		this.render();

	}

	update() {
		this.context.beginPath();
		var testJSON = {
			x: 10,
			y: 10,
			height: 40,
			width: 40,
			title: "Test Node",
			description: "A static node for testing"
		};
		this.nodeBuilder.parseJSON(testJSON);
		this.context.stroke();
		//console.log("update");
	}

	render() {
		console.log("render");
	}

	clear() {
		//console.log("clear");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


	//event listeners
	initEventListeners() {
		document.addEventListener('mousemove', e => {
			this.tick();
		});

		document.addEventListener('mouseup', e => {

		});

		document.addEventListener('mousedown', e => {

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