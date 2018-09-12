define(['socket','core'],function(socket, core){
	return class Obj{
		constructor(x,y,h,w){
			this.x = x;
			this.y = y;
			this.height = h;
			this.width = w;
			this.color = "blue";
			console.log("sfdosfado");
			this.sockets = {
				isFlowIn: true,
				isFlowOut: true,
				inputVars: [],
				outputVars: []
			};
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
				h: this.height,
				w: this.width
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

});