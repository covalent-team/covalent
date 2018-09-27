//socket object
const path = require('path');
const socket = require(path.join(__dirname, '/connector.js'));


var exports = module.exports = {};
 class Socket{
	constructor(sockObj){
		// type: text,
		// 		socketIndex: index,
		// 		onlyOneConnector: false
		this.type = sockObj.type;
		//this.nodeIndex = nodeIndex;
		this.socketIndex = sockObj.socketIndex;	
		this.occupied = [];
		this.onlyOneConnector = sockObj.onlyOneConnector;
		
	}

	getJSON(){
		return {
			type: this.type,
			//nodeIndex: this.nodeIndex,
			socketIndex: this.socketIndex,
			occupied: this.occupied,
			onlyOneConnector: this.onlyOneConnector
		};
	}
}

exports.create = function(sockObj){
	return new Socket(sockObj);
}