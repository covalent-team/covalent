// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//this is where the combination of frontend classes will happen

const board = require(__dirname + "/engine/board.js");
const node = require(__dirname + "/engine/object.js");


const table = board.create();
var mouse = table.getMouse();

var obj1 = node.create(mouse.x, mouse.y, 40, 40);
table.addToStack(obj1);

var obj2 = node.create(100, 100, 40, 40);
table.addToStack(obj2);

// for(var i = 0; i < 1000; i ++){
// 	table.addToStack(node.create(Math.random()* 500,Math.random()* 500,40,40));
// }