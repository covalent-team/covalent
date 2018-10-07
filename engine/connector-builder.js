var exports = module.exports = {};

class connectorBuilder{
	constructor(context){
		this.context = context;
	}

	bezierCurveCalc(start, end){
	    var midpointX = (Math.max(start.x, end.x) - Math.min(start.x, end.x))/1.618;
	    var midpointY = (Math.max(start.y, end.y) - Math.min(start.y, end.y))/1.618;
	    
	    var cp1x = start.x + midpointX;
	    var cp1y = start.y;
	    var cp2x = end.x - midpointX;
	    var cp2y = end.y;

	    
    	var result = {
    		cp1: {x: cp1x, y: cp1y},
        	cp2: {x: cp2x, y: cp2y}
    	};

	    
	    return result;
	}

	makeConnector(start, end, isReversed){
		if(!isReversed){
			this.context.moveTo(start.x,start.y);
			var curve = this.bezierCurveCalc(start, end);
			this.context.bezierCurveTo(curve.cp1.x, curve.cp1.y, curve.cp2.x, curve.cp2.y, end.x, end.y);
		}else{
			this.context.moveTo(end.x,end.y);
			var curve = this.bezierCurveCalc(end, start);
			this.context.bezierCurveTo(curve.cp1.x, curve.cp1.y, curve.cp2.x, curve.cp2.y, start.x, start.y);
		}
		
	}
}

exports.create = function(context){
	return new connectorBuilder(context);
}