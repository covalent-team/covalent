const path = require('path'); 
const boardModule = require(path.join(__dirname, '/board.js')); 
const searchbar = require(path.join(__dirname, '/searchbar.js')); 


class Listeners{
    constructor(){
				
				// Create a board module here 
        this.board = boardModule.create(); 
        this.canvas = this.board.canvas; 
				this.initEventListeners(); 


				// Create the search bar module 
				this.searchBar = searchbar.create(); 
				
				// Get X and Y coordinate 
				this.mouseX = 1;
				this.mouseY = 1; 



    }


    initEventListeners() {
				
			// When user moves the mouse 
			this.canvas.addEventListener('mousemove', e => {
				this.mouseX = e.layerX;  //numbers are static based on side UI
				this.mouseY = e.layerY;
				this.diffMouse = {x: e.movementX, y: e.movementY};
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
				if (e.button === 2 && this.board.dragState.global == true){
						this.searchBar.setLocationMenu(e.clientX, e.clientY); 
						this.searchBar.renderMenu();//'initial'); 
				
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
	
			document.addEventListener('keydown', e => {
	
			});
	
			this.canvas.addEventListener('click', e => {
	
			});
  }
}




exports.create = function(){
	return new Listeners();
}