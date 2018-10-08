// All of the Node.js APIs are available in this process.
//this is where the combination of frontend classes will happen

const fs = require('fs'); 
// ------- RENDERING THE BOARD AND ALLDE THE NODE ENGINES -------- 
const boardModule = require(__dirname + "/engine/board.js");
const listenerModule = require(__dirname +"/engine/listeners.js"); 
// const board = boardModule.create();
const listener = listenerModule.create();
console.log("listener!!!!!", listener);  

