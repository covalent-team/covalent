const fs = require('fs'); 

// This renders the file structure folder on the app 
class RedMenu extends React.Component{
  constructor(props){
		super(props); 
		this.renderedDiv; 
		
		// Explorer Components 
		this.uploadInput =  <input type="file" onChange={ (e) => this.handleChange(e.target.files) }></input> 
		this.state = {
				fileNames: [], 
				menuPath: "", 
				stateTree: [] 
		}
	}

  // Handle workspace creation when user click add file button 
	handleChange(selectorFiles){
		var path = selectorFiles[0].path; 
		var fileName = selectorFiles[0].name; 
		var treePath = path.replace(fileName, '');  
		var getTreeContentPromise = this.getTreeContent(treePath); 
		getTreeContentPromise.then((treeContent) => {
			this.setState({
				fileNames: treeContent, 
				menuPath: treePath 
			})
			this.buildTree();  
		});  
	} 
		
	/* Return an array of content within a path for the tree structure  
		 @return: [file1.png, file2.png...etc.]
	*/ 
	getTreeContent(treePath){
		var localFile = []; 
		return new Promise((resolve, reject) => {
			fs.readdir(treePath, (err, files) => {
				if (err){
					return console.log(err); 
				} else{
					localFile.push(files); 
					resolve(localFile); 
				}
			})
		})
	}

	// Check if a path is directory or a file 
	checkDirectory(path){
		return new Promise((resolve, reject) => {
			fs.lstat(path, (err, stats) => {
				if (err) {
					return console.log(err); 
				} else {
					if (stats.isFile() == true){
						resolve(false); 
					} else {
						resolve(true); 
					}
				}
			})  
		}); 
	}


	buildTree(){
		console.log("this state filenames", this.state.fileNames); 
		var renderedTree = [];   
		var checkDirectoryPromiseArr = []; 
		

		// Return an array if a file is a file, or a directory 
		if (this.state.fileNames.length > 0){
			for (var f in this.state.fileNames[0]){
				var filePath = this.state.menuPath + this.state.fileNames[0][f]; 
				var checkDirectoryPromise = this.checkDirectory(filePath); 
				checkDirectoryPromiseArr.push(checkDirectoryPromise); 
			}

			// Create the icons to embedded within the p tag 
			var folderIcon = <i className="fas fa-folder-open"></i>; 
			var fileIcon = <i className="fas fa-file"></i>
			var folderLine = <p>{folderIcon}Hello World</p>; 
		
			// Create the <p> tag for each file and folder icon and add it to the rendered tree 
			Promise.all(checkDirectoryPromiseArr).then((checkDirectoryArrVal) => {
				checkDirectoryArrVal.forEach((val, i) => {
					if (val == true){
						var folderLine = <p key={i}> {folderIcon}{this.state.fileNames[0][i]}</p>
						renderedTree.push(folderLine); 
					} 
					else{
						var fileLine = <p key={i}> {fileIcon}{this.state.fileNames[0][i]}</p> 
						renderedTree.push(fileLine); 
					}
				})
				this.setState({
					stateTree: renderedTree
				}); 
			})
		}
	}

	

  // Return a list of files if user had added workspace 
	render(){
		if (this.state.stateTree.length > 0){
			console.log("statetree", this.state.stateTree);  
			return (
				<div>
					<h4>Workspace</h4>
					{this.state.stateTree}
				</div>
			)
		}
		


		// Else return input box for user to chooose file 
		return ( 
				<div>
						<h4>Workspace</h4> 
						{this.uploadInput}
				</div>
		)
	}
}

// Render the black menu from react. 
ReactDOM.render(
    <RedMenu/>,
    document.getElementById('redmenu')
);

// Export the red menu modules 
module.exports.RedMenu = RedMenu; 