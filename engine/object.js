var exports = module.exports = {};

class Object{
	constructor(x,y,h,w){
		this.x = x;
		this.y = y;
		this.height = h;
		this.width = w;
		this.args = [false,false];
		this.returns = [false,false];
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
			y: this.y,
		};
	}

	addConnector(type, index){
		if(type == 'args'){
			this.args[index] = true;
		}
		else if(type == 'returns'){
			this.returns[index] = true;
		}
	}

	checkArgsConnector(index){
		return this.args[index];
	}

	getJSON(){
		return {
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width,
			args: this.args,
			returns: this.returns,
			isEvent: false,
			isReturn: false,
			isPure: false
		};
	}

	addRelativeXY(x,y){
		this.x += x;
		this.y += y;
	}

	update(){
		//console.log("obj updated");
	}
}

exports.create = function(x,y,w,h){
	return new Object(x,y,w,h);
}