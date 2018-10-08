var exports = module.exports = {}; 
const path = require('path'); 
const node = require(path.join(__dirname, '/node-object.js')); 
const board = require(path.join(__dirname, '/board.js'));  

var o1 = {
	x: 1,
	y: 1,
	width: 60,
	height: 60,
	args: 2,
	returns: 2,
	leftExecs: 2,
	rightExecs: 2,
	isPure: false
};


class SearchBar{

	// Constructor for the search bar menu 
	constructor(){

		// Rendered menu variables 
		this.canvasMenuClass = document.getElementsByClassName('canvasMenu');  
		this.canvasMenuSearchResultClass = document.getElementsByClassName('canvasMenuSearchResults'); 
		this.menudiv = document.createElement("div");   
		this.menuComponents = ["function", "loop", "if", "variable", "boolean", "number", "string", "bytes", "object", "null"]; 
		this.searchbar = document.createElement("input");   

		// Filter array when user search for term, so the search results will change and not all menu components will be rendered 
		this.filterArray = new Set(); 
		this.isCreated = false;

		// Position x and y where the menu will be rendered 
		this.currentMenuPositionX = 0; 
		this.currentMenuPositionY = 0; 

		// The white box to contain the search bar and results. 
		this.menudiv.className = "canvasMenu";
		this.menudiv.style.position = "absolute"; 
		

		// Build the searchbar inside the menu. 
		this.searchbar.className = "canvasMenuSearchBar"; 
		this.searchbar.placeholder = "Search"; 
		

		// Build the search bar results beneath the search bar. 
		this.searchResultsDiv = document.createElement("div");
		this.searchResultsDiv.className = "canvasMenuSearchResults"; 
		this.searchResultsDiv.id = 'searchResultsDivID'; 


		// Importing from other classes
		this.newStuff = ''; 
		

}

	// Set the location of the menu when user clicked on the screen 
	setLocationMenu(currentMenuPositionX,currentMenuPositionY ){
		this.currentMenuPositionX = currentMenuPositionX; 
		this.currentMenuPositionY = currentMenuPositionY; 
	}

	// Function to render menu every time user click right click, this will be called 
	renderMenu(){

		// Draw menu at x and y position where user click on screen   
		this.menudiv.style.top = this.currentMenuPositionY + "px"; 
		this.menudiv.style.left = this.currentMenuPositionX + "px"; 

			// If array hasn't been created, then create a new menu bar, search bar and result div 
			if(!this.isCreated){
				document.body.appendChild(this.menudiv); 
				this.menudiv.appendChild(this.searchbar);
				this.filterArray = this.menuComponents;
				this.searchResultsDiv = this.renderSearchComponents();
				this.menudiv.appendChild(this.searchResultsDiv); 
				this.isCreated = true;
			}

			// If array has been created, just re-render the search component 
			else{
				var newSearchResultsDiv = this.renderSearchComponents();
				this.menudiv.replaceChild(newSearchResultsDiv, this.searchResultsDiv);
				this.searchResultsDiv = newSearchResultsDiv; 
			}
	}


	// Return array of p tags which are the result  
	renderSearchComponents(){

		// Create a new research result div 
		var newSearchResultsDiv = document.createElement("div");
		newSearchResultsDiv.className = "canvasMenuSearchResults"; 
		newSearchResultsDiv.id = 'searchResultsDivID'; 

		// The components of P tags are taken from the filter array 
		var componentArr = Array.from(this.filterArray);
			if (componentArr.length == 0)
					componentArr = this.menuComponents;

			// For ecah component in filter array, create a <p></p> tag 
			for (var i in componentArr){
					var componentStr = document.createTextNode(componentArr[i]);  
					var componentP = document.createElement("p"); 
					componentP.appendChild(componentStr); 
					componentP.value = componentArr[i]; 
					componentP.addEventListener('click',this.clickedResult,false); 
					newSearchResultsDiv.appendChild(componentP); 
			}
			return newSearchResultsDiv;
	}

	/* ---------- ALL CLEARING RENDERING FUNCTION WILL GOES DOWN HERE ----------- */ 
	// Erase all previously built menu. 
	clearMenu(){
			try{
				this.searchbar.parentNode.removeChild(this.searchbar);  
				this.searchResultsDiv.parentNode.removeChild(this.searchResultsDiv);  
				this.menudiv.parentNode.removeChild(this.menudiv); 
				this.isCreated = false; 
				this.clickedResultVal = '';  
			}
			catch (err){
				console.error("Error", err); 
			}
	}


	// This filter the word user is currently searching. 
	filterSearch(){

		// Get the current word input from the search bar, and filter with only the word 
			var word = this.searchbar.value; 
			this.filterArray = new Set();  
			if (word){
					for (var i in this.menuComponents){
							var component = this.menuComponents[i]; 
							var inComponent = component.includes(word); 
							if (inComponent == true){
									this.filterArray.add(component); 
							}	
					}
			} else{
					this.filterArray = new Set(); 
			}
			this.renderMenu(); 
	}

	// This function will be called when the p tag is being clicked on 
	clickedResult(evt){

		// If it's a function, then create a box on the screen 
		if (evt.target.value == 'function'){
			console.log("creating function here"); 
			var obj1 = node.create(o1); 
			this.newStuff = obj1; 
		}
	}

	getNewStuff(){
		console.log("Newly rendered object", this.newStuff); 
		return this.newStuff; 
	}
	
}

// Exports the function 
exports.create = function(){
	return new SearchBar();
}

