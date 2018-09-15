var exports = module.exports = {};

class Object{
	constructor(x,y,h,w){
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
	}

	draw(context){
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);
		
	}

	changeColor(color){
		this.color = color;
	}

	getLocData(){
		return {
			x: this.x,
			y: this.y
		};
	}

	getJSON(){
		return {
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width
		};
	}

	setX(x){
		this.x = x;
	}

	setY(y){
		this.y = y;
	}

	update(){
		//console.log("obj updated");
	}
}

exports.create = function(x,y,w,h){
	return new Object(x,y,w,h);
}