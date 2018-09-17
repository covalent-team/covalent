class BlackMenu extends React.Component{

    // Construtor 
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

        console.log("this button arr", this.buttonArr); 
    }


    // When user click on menu button, change the state. 
    handleClick(menuKey){
        this.setState({
            clicked: menuKey  
        });        
    } 

    
    // Render all the buttons. 
    render(){
        return (
            <div>{this.buttonArr}</div>
        )
    }
}

  ReactDOM.render(
    <BlackMenu/>,
    document.getElementById('blackmenu')
  );