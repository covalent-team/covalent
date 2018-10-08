const path = require('path'); 
const boardModule = require(path.join(__dirname, '/board.js')); 
const searchbar = require(path.join(__dirname, '/searchbar.js')); 


class Listeners{
    constructor(){
				
			// Create all modules here 
			this.board = boardModule.create(); 
			this.searchBar = searchbar.create(); 
			this.searchBar.setBoardInstance(this.board); 


			// Get objects from the modules 
			this.canvas = this.board.canvas; 
			this.initEventListeners(); 
		
			
			// Get X and Y coordinate 
			this.mouseX = 1;
			this.mouseY = 1; 
		
		}
	
		// These are all event listeners that will happen when user press mouse or keyboard 
    initEventListeners() {

				
			// When user moves the mouse, get X and Y coordinate 
			this.canvas.addEventListener('mousemove', e => {
				this.mouseX = e.layerX;   
				this.mouseY = e.layerY;
				this.diffMouse = {x: e.movementX, y: e.movementY};
				this.board.setMouse(this.mouseX, this.mouseY, this.diffMouse);
				this.board.tick();
			});
    
    
      // When user release the mouse 
			this.canvas.addEventListener('mouseup', e => {
				this.board.resetDragState();
				this.board.globalOrNodeDrag();
	
			});
	
    
			// When user press down the mouse 
			this.canvas.addEventListener('mousedown', e => {
				this.board.globalOrNodeDrag();

				// If user left click, erase menu else create menu 
				if (e.button === 0){
						this.searchBar.clearMenu(); 
				}

				// If user right click,  then create a menu search 
				if (e.button === 2 && this.board.dragState.global == true){
						this.searchBar.setLocationMenu(e.clientX, e.clientY); 
						this.searchBar.renderMenu(); 
						this.board.resetDragState(); 
						return; 
				}
				this.board.dragState.clicked = true;
			});
	

			// Listen to wheel event 
			this.canvas.addEventListener('wheel', e => {
			    this.board.mouseWheelZoom(e);
			    this.board.tick();
			});
	
    
			// When user removes their hand from the keyboard 
			document.addEventListener('keyup', e => {
					this.searchBar.filterSearch();   
			});
	
			// When user removes their hand down on the keyboard  
			document.addEventListener('keydown', e => {
	
			});
	
			// When user click on the canvas 
			this.canvas.addEventListener('click', e => {
	
			});
  }
}




exports.create = function(){
	return new Listeners();
}
