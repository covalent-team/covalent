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
		// this.renderSearchComponents(this.searchResultsDiv, this.menuComponents); 


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
	renderMenu(){
		this.menudiv.style.top = this.currentMenuPositionY + "px"; 
		this.menudiv.style.left = this.currentMenuPositionX + "px"; 

			// If array hasn't been created 
			if(!this.isCreated){
				document.body.appendChild(this.menudiv); 
				this.menudiv.appendChild(this.searchbar);
				this.filterArray = this.menuComponents;
				this.searchResultsDiv = this.renderSearchComponents();
				this.menudiv.appendChild(this.searchResultsDiv); 
				this.isCreated = true;
			}
			else{
				//document.body.replaceChild(this.menudiv, this.menudiv); 
				//this.menudiv.replaceChild(this.searchbar, this.searchbar);
				var newfuckingthing = this.renderSearchComponents();
				console.log("new fucking thing!!!", newfuckingthing); 
				this.menudiv.replaceChild(newfuckingthing, this.searchResultsDiv);
				this.searchResultsDiv = newfuckingthing; 
			}
	}


	// Return array of p tags which are the result 
	// searchresults (type: div): the div which contains the search results components
	// componentArr (type: arr): the list of search terms that will be displayed on the search results 
	renderSearchComponents(){
		var newSearchResultsDiv = document.createElement("div");
		newSearchResultsDiv.className = "canvasMenuSearchResults"; 
		newSearchResultsDiv.id = 'searchResultsDivID'; 

		var componentArr = Array.from(this.filterArray);
			if (componentArr.length == 0)
					componentArr = this.menuComponents;
			console.log("Component arr", componentArr); 
			for (var i in componentArr){
					var componentStr = document.createTextNode(componentArr[i]);  
					var componentP = document.createElement("p"); 
					componentP.appendChild(componentStr); 
					componentP.onclick = function(){ this.clickedResultFunc(componentStr); };
					newSearchResultsDiv.appendChild(componentP); 
			}
			//this.searchResultsDiv = newSearchResultsDiv;
			console.log("Search results div", newSearchResultsDiv); 
			return newSearchResultsDiv;
	}



	/* ---------- ALL CLEARING RENDERING FUNCTION WILL GOES DOWN HERE ----------- */ 
	// Erase all previously built menu. 
	clearMenu(){
			// try {
			// 	while (this.canvasMenuClass.length > 0) 
			// 			this.canvasMenuClass[0].remove(); 
			// } catch(err){
			// 		console.error("Error", err); 
			// }
			this.searchbar.parentNode.removeChild(this.searchbar);  
			this.searchResultsDiv.parentNode.removeChild(this.searchResultsDiv);  
			this.menudiv.parentNode.removeChild(this.menudiv); 
			
			this.isCreated = false; 
	}



	// This filter the word user is currently searching. 
	// var search = /fun/g
	filterSearch(){
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
			//edit the list
			this.renderMenu(); 
	}



	// This function will be called when the p tag is being clicked on 
	clickedResultFunc(word){
		console.log("Word", word); 
	}
}


exports.create = function(){
	return new SearchBar();
}

