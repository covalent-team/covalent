var exports = module.exports = {};

class nodeBuilder{
	constructor(context){
		this.context = context;
	}



	parseJSON(json){
		this.context.rect(json.x, json.y, json.width, json.height);
	}
}

exports.create = function(context){
	return new nodeBuilder(context);
}