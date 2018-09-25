var exports = module.exports = {};

 class Connector{
	constructor(start, end, reversed){
		this.start = start;
		this.end = end;
		this.isReversed = reversed;
	}

	getJSON(){
		return {
			start: this.start,
			end: this.end,
			isReversed: this.isReversed
		};
	}
}

exports.create = function(start, end, reversed){
	return new Connector(start, end, reversed);
}