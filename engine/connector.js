define(function(){
	return class Connector{
		constructor(startX, startY, endX, endY){
			this.startX = startX;
			this.startY = startY;
			this.endX = endX;
			this.endY = endY;

			var bezier = this.bezierCurveCalc(this.startX, this.startY, this.endX, this.endY);
			this.cp1x = bezier.cp1x;
			this.cp1y = bezier.cp1y;
			this.cp2x = bezier.cp2x;
			this.cp2y = bezier.cp2y;
		}

		bezierCurveCalc(startX, startY, endX, endY){
		    var midpointX = (Math.max(startX, endX) - Math.min(startX, endX))/2;
		    var midpointY = (Math.max(startY, endY) - Math.min(startY, endY))/2;
		    
		    var cp1x = startX + midpointX;
		    var cp1y = startY;
		    var cp2x = endX - midpointX;
		    var cp2y = endY;
		    
		    return {
		        cp1x: cp1x,
		        cp1y: cp1y,
		        cp2x: cp2x,
		        cp2y: cp2y
		    };
		}

		draw(){
			
		}
	}
})