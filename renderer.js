// All of the Node.js APIs are available in this process.
//this is where the combination of frontend classes will happen
'use strict'; 
const fs = require('fs'); 
// ------- RENDERING THE BOARD AND ALLDE THE NODE ENGINES -------- 
const boardModule = require(__dirname + "/engine/board.js");
const listenerModule = require(__dirname +"/engine/listeners.js"); 


var listener = listenerModule.create(); 