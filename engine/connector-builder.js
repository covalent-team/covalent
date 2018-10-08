var exports = module.exports = {};


// This
class connectorBuilder{
	constructor(context, nodeBuilder, nodeStack){
		this.context = context;
		this.nodeBuilder = nodeBuilder; 
		this.nodeStack = nodeStack;  
	}

	// Get the node builder and the node stack from board.js 
	setConnectorBuilderInstance(nodeBuilder, nodeStack){
		this.nodeBuilder = nodeBuilder; 
		this.nodeStack = nodeStack; 
	}

	// This calculate the curve to draw the connector on the screen 
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

	// This make the connector 
	makeConnector(start, end, isReversed){
		if(!isReversed){
			this.context.moveTo(start.x,start.y);
			var curve = this.bezierCurveCalc(start, end);
			this.context.bezierCurveTo(curve.cp1.x, curve.cp1.y, curve.cp2.x, curve.cp2.y, end.x, end.y);
		} else{
			this.context.moveTo(end.x,end.y);
			var curve = this.bezierCurveCalc(end, start);
			this.context.bezierCurveTo(curve.cp1.x, curve.cp1.y, curve.cp2.x, curve.cp2.y, start.x, start.y);
		}
	}


	// BuildConnectorOnScreen: this build the connector given two nodes FirstNode and SecondNode 
	// connectorStack: this looks into all connectors and start drawing them 
	buildConnectorOnScreen(connectorStack){
		this.connectorStack = connectorStack; 
		for(var i in this.connectorStack){
			var connectorInfo = this.connectorStack[i].getJSON();
			var firstNode = this.nodeBuilder.getHitZones(this.nodeStack[connectorInfo.start.nodeIndex].getJSON());
			var secondNode = this.nodeBuilder.getHitZones(this.nodeStack[connectorInfo.end.nodeIndex].getJSON());
		
			// Get the start point of one connector, and end point of another connector 
			var startPoint = this.handleConnectorLogic(connectorInfo.start, firstNode);
			var endPoint = this.handleConnectorLogic(connectorInfo.end, secondNode); 

			// Start drawing on the 
			this.context.beginPath();
			this.makeConnector(startPoint, endPoint, connectorInfo.isReversed);
			this.context.stroke();
		}
	}


	// HandleConnectorLogic: this function handles the logic of drawing a connector between two nodes 
	// @param connectorPoint:  the head or tail of the connector 
	// @param node: the firstNode or the secondNode which the connector links together 
	handleConnectorLogic(connectorPoint, node){

		// SocketType = args, returns, leftExecs, rightExecs   
		var socketType = connectorPoint.socketType;   

		// Corresponding array to socket type 
		var d = {
			'args': node.args, 
			'returns': node.returns, 
			'leftExec': node.leftExec, 
			'rightExec': node.rightExec 
		}

		// Return the array of socket of type args, returns, leftExec, rightExec 
		var arrOfSocket = d[socketType]; 

		// Set the x and y value and return them 
		var xVal = ''; var yVal = ''; 
		if (socketType == 'args' || socketType == 'returns') {
			xVal = arrOfSocket[connectorPoint.socketIndex].x; 
			yVal = arrOfSocket[connectorPoint.socketIndex].y;  
		} else if (socketType == 'leftExec' || socketType == 'rightExec'){
			xVal = arrOfSocket[connectorPoint.socketIndex].x + arrOfSocket[connectorPoint.socketIndex].width / 2; 
			yVal = arrOfSocket[connectorPoint.socketIndex].y + arrOfSocket[connectorPoint.socketIndex].height / 2;   
		}
		
		// Return x and y value 
		return {
			x: xVal, 
			y: yVal 
		}
	}
}

// Export the connector builder function 
exports.create = function(context){
	return new connectorBuilder(context);
}