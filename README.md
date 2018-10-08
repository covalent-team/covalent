# Covalent

A drag-and-drop visual scripting language that will compile to JavaScript, built using Electron and ReactJS. 
Modelled after Unreal Engine Blueprint. 

## Misson

The misson of Covalent is to provide an easily extendable, node based editor which will allow novices and experts to quickly build Javascript code without actually writing a single line. This code can be used for frontend functionality, as well as backend node.js code. This could mean that a person could potentially build a full API using Nodejs using a Covalent, all drag-and-drop.

This is a brand new open source project, and there is still a long way to go, but I hope that you will join us on this adventure.

Join our Discord! - https://discord.gg/VVBMWGG

## Architecture of the Class 
There are currently 8 classes containing within this file, within the engine folder: 
engine/
    ├── board.js                         # the board that contains all the node object, connectors and sockets 
    ├── connector-builder.js             # this build the connector between the two node 
    ├── connector.js                     # this is the class to create a connector 
    ├── listeners.js                     # this handle all event listeners (mousedown, mouseup..etc.) and is the root class 
    ├── node-builder.js                  # this build the node itself             
    ├── node-object.js                   # this is the class to create a node object itself 
    ├── searchbar.js                     # this is the searchbar to create a node, connector, socket...etc. 
    └── socket.js                        # this is the socket 

## To Use
```bash
# Clone this repository
git clone https://github.com/covalent-team/covalent.git 
# Go into the repository
cd covalent 
# Install dependencies
npm install 
npm install --global gulp-cli 
# Run the app
gulp 
```
Make sure you have [Gulp](https://github.com/gulpjs/gulp/blob/v3.9.1/docs/getting-started.md) installed both globally and locally. 

## Resources 
- Live Reload with Electron-Connect: https://github.com/Quramy/electron-connect  


## License

[CC0 1.0 (Public Domain)](LICENSE.md)
