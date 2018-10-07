var exports = module.exports = {}; 

class SearchBar{

	// Constructor for the search bar menu 

	constructor(){
		// -------- Rendered menu variables --------- 
		this.canvasMenuClass = document.getElementsByClassName('canvasMenu');  
		this.canvasMenuSearchResultClass = document.getElementsByClassName('canvasMenuSearchResults'); 
		this.menudiv = document.createElement("div");   
		this.menuComponents = ["function", "loop", "if", "variable", "boolean", "number", "string", "bytes", "object", "null"]; 
		this.searchbar = document.createElement("input");   

		// Filter array when user search for term, so the search results will change and not all menu components will be rendered 
		this.filterArray = new Set(); 

		// Position x and y where the menu will be rendered 
		this.currentMenuPositionX = 0; 
		this.currentMenuPositionY = 0; 
}


	// Set the location of the menu when user clicked on the screen 
	setLocationMenu(currentMenuPositionX,currentMenuPositionY ){
		this.currentMenuPositionX = currentMenuPositionX; 
		this.currentMenuPositionY = currentMenuPositionY; 
	}

	// Draw menu at x and y position where user click on screen  
	// State denotes if menu is already open or currently being search 
	// 1. Initial: user first create a menu 
	// 2. Searching: user already create menu, but currently searching so we don't need to clear the menu 
	renderMenu(state){

			// If user first create the menu by right click mouse. 
			if (state == 'initial'){
					this.clearMenu();  

					// The white box to contain the search bar and results. 
					this.menudiv.className = "canvasMenu";
					this.menudiv.style.position = "absolute"; 
					this.menudiv.style.top = this.currentMenuPositionY + "px"; 
					this.menudiv.style.left = this.currentMenuPositionX + "px"; 
					document.body.appendChild(this.menudiv); 

					// Build the searchbar inside the menu. 
					this.searchbar.className = "canvasMenuSearchBar"; 
					this.searchbar.placeholder = "Search"; 
					this.menudiv.appendChild(this.searchbar);

					// Build the search bar results beneath the search bar. 
					var searchResultsDiv = document.createElement("div");
					searchResultsDiv.className = "canvasMenuSearchResults"; 
					searchResultsDiv.id = 'searchResultsDivID'; 
					this.renderSearchComponents(searchResultsDiv, this.menuComponents); 
					this.menudiv.appendChild(searchResultsDiv);  
			}


			// If user is currently searching, re-rendering the menu 
			else{
					document.getElementById("searchResultsDivID").outerHTML = ""; 
					var searchResultsDiv = document.createElement("div");
					searchResultsDiv.className = "canvasMenuSearchResults"; 
					searchResultsDiv.id = 'searchResultsDivID';  
					this.renderSearchComponents(searchResultsDiv, Array.from(this.filterArray)); 
					this.menudiv.appendChild(searchResultsDiv);  
			}

	}

	// Return array of p tags which are the result 
	// searchresults (type: div): the div which contains the search results components
	// componentArr (type: arr): the list of search terms that will be displayed on the search results 
	renderSearchComponents(searchResultsDiv, componentArr){
			console.log("Backspace should also call this!!!!"); 
			if (componentArr.length == 0)
					componentArr = this.menuComponents; 
			for (var i in componentArr){
					var componentStr = document.createTextNode(componentArr[i]);  
					var componentP = document.createElement("p"); 
					componentP.appendChild(componentStr); 
					searchResultsDiv.appendChild(componentP); 
			}
			console.log("Search results div", searchResultsDiv); 
	}



	/* ---------- ALL CLEARING RENDERING FUNCTION WILL GOES DOWN HERE ----------- */ 
	// Erase all previously built menu. 
	clearMenu(){
			console.log("Clear menu is called!!!!"); 
			try {
					while (this.canvasMenuClass.length > 0) 
							this.canvasMenuClass[0].remove(); 
			} catch(err){
					console.error("Error", err); 
			}
	}



	// This filter the word user is currently searching. 
	// var search = /fun/g
	filterSearch(){
			var word = this.searchbar.value; 
			console.log("Word", word); 
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
			this.renderMenu('searching'); 
	}
}


exports.create = function(){
	return new SearchBar();
}

