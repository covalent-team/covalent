var exports = module.exports = {};

class nodeBuilder{
	constructor(context){
		this.context = context;
		this.zoom = 1;
	}

	getHitZones(json){
		var i;
		
		json.x = json.x * this.zoom;
		json.y = json.y * this.zoom;
		json.height = json.height * this.zoom;
		json.width = json.width * this.zoom;

		var bottomLeft = {
			x: json.x,
			y: json.y + json.height
		};

		var bottomRight = {
			x: json.x + json.width,
			y: json.y + json.height
		};

		var leftExecs = [], rightExecs = [];

		if(!json.isPure){
			for(i = 0; i < json.leftExecs.length; i++){
				var leftExecSocket = {
					x: json.x - (10 * this.zoom),
					y: json.y + (i* 15 * this.zoom), 
					width: 10 * this.zoom, 
					height: 10 * this.zoom
				};
				leftExecs.push(leftExecSocket);
			}

			for(i = 0; i < json.rightExecs.length; i++){
				var rightExecSocket = {
					x: json.x + json.width,
					y: json.y + (i* 15 * this.zoom), 
					width: 10 * this.zoom, 
					height: 10 * this.zoom
				};
				rightExecs.push(rightExecSocket);
			}
		}
		var args = []; var returns = [];

		for(i = 0; i < json.args.length; i++){
			var objargs = {
				x: bottomLeft.x,
				y: bottomLeft.y - (i* 15 * this.zoom),
				radius: 5 * this.zoom,
				index: i
			};
			args.push(objargs);
		}

		for(i = 0; i < json.returns.length; i++){
			var objreturns = {
				x: bottomRight.x,
				y: bottomRight.y - (i* 15 * this.zoom),
				radius: 5 * this.zoom,
				index: i
			};
			returns.push(objreturns);
		}

		return {
			x: json.x,
			y: json.y,
			width: json.width,
			height: json.height,
			leftExec: leftExecs, 
			rightExec: rightExecs,
			args: args,
			returns: returns
		};
	}

	//fill shape color
	fillColor(color){
	if(color){
			this.context.fillStyle = color;
		}
		else{
			this.context.fillStyle = "white";
		}
		this.context.fill();
	}

	addZoom(zoom){
		this.zoom = zoom;
	}

	parseJSON(json){

	
		var i;
		//main node body
		json.x = json.x * this.zoom;
		json.y = json.y * this.zoom;
		json.height = json.height * this.zoom;
		json.width = json.width * this.zoom;



		this.context.beginPath();
		this.context.rect(json.x, json.y, json.width, json.height);
		this.context.stroke();

		//args and return sockets
		var bottomLeft = {
			x: json.x,
			y: json.y + json.height
		};

		var bottomRight = {
			x: json.x + json.width,
			y: json.y + json.height
		};

		if(!json.isPure){
			for(i = 0; i < json.leftExecs.length; i++){
				this.context.beginPath();
				this.context.rect(json.x - (10 * this.zoom), json.y + (i* 15 * this.zoom), 10 * this.zoom, 10 * this.zoom);
				this.fillColor();
				this.context.stroke();
			}

			for(i = 0; i < json.rightExecs.length; i++){
				this.context.beginPath();
				this.context.rect(json.x + json.width, json.y + (i* 15 * this.zoom), 10 * this.zoom, 10 * this.zoom);
				this.fillColor();
				this.context.stroke();
			}
		}

		for(i = 0; i < json.args.length; i++){
			this.context.beginPath();
			this.context.arc(bottomLeft.x, bottomLeft.y - (i* 15 * this.zoom),5 * this.zoom,0,2*Math.PI);
			this.fillColor(json.args[i].color);
			this.context.stroke();
		}

		for(i = 0; i < json.returns.length; i++){
			this.context.beginPath();
			this.context.arc(bottomRight.x, bottomRight.y - (i* 15 * this.zoom),5 * this.zoom,0,2*Math.PI);
			this.fillColor(json.returns[i].color);
			this.context.stroke();
		}
			
	}
}

exports.create = function(context){
	return new nodeBuilder(context);
}