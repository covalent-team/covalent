/*
    The black menu renders the list of icons on the black vertical menu bar.
    It contains a state called clicked, to mark the ID (name) of the button being clicked
    There are currently 5 buttons in total.
*/

const RedMenu = module.exports.RedMenu; 

class BlackMenu extends React.Component{

    // Construtor to initalize when the menu bar is first rendered 
    constructor(props){
        super(props);  
        this.buttonArr = []; 
        this.state = {clicked: 'Explorer'};  
        this.menuKeys = ["Explorer", "Build", "Run", "Debug", "Settings"]; 
        this.icons = ["fas fa-file", "fas fa-wrench", "fas fa-play", "fas fa-bug", "fas fa-cogs"]; 

        // Create an array of buttons with property and click function 
        this.icons.forEach((icon,i) => {
            this.button = 
                <button key={this.menuKeys[i]} 
                        onClick={() => this.handleClick(this.menuKeys[i])}>
                        <i className={icon}></i>
                </button>;  
            this.buttonArr.push(this.button);  
        }); 
    }


    // When user click on menu button, change the state. 
    handleClick(menuKey){
        this.setState({
            clicked: menuKey  
        });    
    } 

    // Create a div to contain and render all buttons. 
    render(){
        return (
            <div>
                {this.buttonArr}
                {/* <RedMenu clicked="exploration" />  */}
            </div>
        )
    }
}

// Render the black menu from react. 
ReactDOM.render(
    <BlackMenu/>,
    document.getElementById('blackmenu')
);
