//Node object
const path = require('path');
const socket = require(path.join(__dirname, '/socket.js'));

var exports = module.exports = {};
class Object{
	constructor(nodeObject){
		// x: 1,
		// 	y: 1,
		// 	width: 40,
		// 	height: 40,
		// 	args: 2,
		// 	returns: 2,
		// 	leftExecs: 2,
		// 	rightExecs: 2
		this.x = nodeObject.x;
		this.y = nodeObject.y;
		this.height = nodeObject.height;
		this.width = nodeObject.width;
		this.args = [];
		this.returns = [];
		this.leftExecs = [];
		this.rightExecs = [];
		this.isPure = nodeObject.isPure;

		var socketNums = [
			nodeObject.leftExecs, nodeObject.rightExecs, 
			nodeObject.args, nodeObject.returns];

		function makeSocketObj(array, text){
			let index = array.length;
			return {
				type: text,
				socketIndex: index,
				onlyOneConnector: false
			};
		}

		// This function adds sockets and return a
		for(var i = 0; i < socketNums.length; i++){  //hardcoded onlyOneConnector
			for(var j = 0; j < socketNums[i]; j++){
				switch(i){
					case 0:
						console.log("leftExecs");
						this.leftExecs.push(socket.create(makeSocketObj(this.leftExecs,"leftExec")));
						break;
					case 1:
						console.log("rightExecs");
						this.rightExecs.push(socket.create(makeSocketObj(this.rightExecs,"rightExec")));
						break;
					case 2:
						console.log("args");
						this.args.push(socket.create(makeSocketObj(this.args,"args")));
						break;
					case 3:
						console.log("returns");
						this.returns.push(socket.create(makeSocketObj(this.returns,"returns")));
						break;
				}
			}
		}
		
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

	setNodeIndex(index){
		this.nodeIndex = index;
	}


	getJSON(){
		return {
			x: this.x,
			y: this.y,
			height: this.height,
			width: this.width,
			args: this.args,
			returns: this.returns,
			leftExecs: this.leftExecs,
			rightExecs: this.rightExecs,
			isPure: this.isPure
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

exports.create = function(nodeObject){
	return new Object(nodeObject);
}