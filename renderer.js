// This file is required by the index.html file and will
// be executed in the renderer process for that window.
// All of the Node.js APIs are available in this process.

//this is where the combination of frontend classes will happen

const board = require(__dirname + "/engine/board.js");
const table = board.create();
