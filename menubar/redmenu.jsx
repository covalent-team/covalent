const fs = require('fs'); 

class RedMenu extends React.Component{
    constructor(props){
        super(props); 
        this.renderedDiv; 
      
        // Explorer Components 
        this.uploadInput =  <input type="file" onChange={ (e) => this.handleChange(e.target.files) }></input> 
        this.state = {
            fileNames: [] 
        }
    }

    // Get a list of files when user click add workspace 
    handleChange(selectorFiles){
        var name = selectorFiles[0].name;
        var path = selectorFiles[0].path.replace(name, ''); 
        var localFile = []; 
        fs.readdir(path, (err, files) => { 
            localFile.push(files); 
            this.setState({
                fileNames: localFile 
            });   
        }); 
      
    } 

    checkDirectory(file){
        fs.lstat(path, (err, stats) => {
            console.log(stats)
            console.log("lstat running"); 
            if(err) return console.log(err); 
            else{
                console.log(`Is file: ${stats.isFile()}`); 
                console.log(`Is directory: ${stats.isDirectory()}`); 
            }
        })
    }

    // Return a list of files if user had added workspace 
    render(){
        console.log("this is the filenames", this.state.fileNames); 
        const folderTree = []; 
        if (this.state.fileNames.length > 0){
            for (var f in this.state.fileNames[0]){
                var fileHTML = <p key={f}>{this.state.fileNames[0][f]} </p>;  

                folderTree.push(fileHTML); 
            }
            return (
                <div>
                    <h4>Workspace</h4> 
                    {folderTree}
                </div>
            ); 
        }
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