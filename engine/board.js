//engine core
var exports = module.exports = {};

class Board{
	constructor(){
		this.canvas = document.createElement('canvas');
		document.body.appendChild(this.canvas);
		this.context = this.canvas.getContext('2d');

		this.canvas.width  = document.body.clientWidth;
  		this.canvas.height = document.documentElement.scrollHeight/1.618;
  		this.initEventListeners();
	}

	getContext(){
		return this.context;
	}

	addToStack(item){
	}

	tick() {
		this.clear();
		this.update();
		this.render();
	}

	update() {
		//console.log("update");
	}

	render() {
	}

	clear() {
		//console.log("clear");
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}


	//event listeners
	initEventListeners() {
		document.addEventListener('mousemove', e => {
			console.log('mousemove');
		})
	}
}

exports.create = function(){
	return new Board();
}