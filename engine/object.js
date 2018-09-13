define(['socket','core'],function(socket, core){
	return class Obj{
		constructor(x,y,h,w){
			this.x = x;
			this.y = y;
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