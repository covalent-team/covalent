// All of the Node.js APIs are available in this process.
//this is where the combination of frontend classes will happen

const fs = require('fs'); 
// ------- RENDERING THE BOARD AND ALLDE THE NODE ENGINES -------- 
const board = require(__dirname + "/engine/board.js");
const table = board.create();

