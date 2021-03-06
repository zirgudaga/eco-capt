import React from 'react';
import "./MainNavBar.css";

export default class MainNavBar extends React.Component {

    showMyAddress = () => {    
        if(this.props.state.accounts !== null){
            switch(this.props.state.myTypeUser){
                case '1': return <span><i key="fa-crown" className="fas fa-crown"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;
                case '2': return <span><i key="fa-user" className="fas fa-user"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;
                case '3': return <span><i key="fa-gavel" className="fas fa-gavel"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;   
                case '4': return <span><i key="fa-user-astronaut" className="fas fa-user-astronaut"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;   
                case '5': return <span><i key="fa-sitemap" className="fas fa-sitemap"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;   
                case '9': return <span><i key="fa-search-location" className="fas fa-search-location"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;
                default : return <span><i key="fa-question" className="fas fa-question"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;
            }
        } 
        else{
            return <span>Waiting<i key="fa-hourglass-half" className="fas fa-hourglass-half"></i></span>;
        }       
    }

    showMyContract = () => {    
        
        if(this.props.state.myTypeUser==='2'){
            return(   
                <span className="main-list"><i key="fa-clipboard" className="fas fa-clipboard"></i>{this.props.state.customerContractAddress.substr(0,5)+'...'+this.props.state.customerContractAddress.substr(-4)}           
                </span>
            );
        }   

        if(this.props.state.customerContractAddress !== null){
            if(this.props.state.myTypeUser !== -1){
                return <span className="main-list"><i key="fa-clipboard" className="fas fa-clipboard"></i>{this.props.state.customerContractAddress.substr(0,5)+'...'+this.props.state.customerContractAddress.substr(-4)}
                <span className="x-close" onClick={()=>this.props.contractClose()}>X</span>
                </span>;
            }   
        } 
        else{
            return <span className="main-list">No contract selected...</span>;
        }       
    }    


    render() {
        return ( 
            <header className="welcome-navbar">
                <div className="wrap">
                    <a href="."><img width="250" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    <nav>
                        <ul>

                            { (this.props.state.myTypeUser==='1' 
                            || this.props.state.myTypeUser==='3' 
                            || this.props.state.myTypeUser==='4')      
                            &&
                                <li className="main-list" onClick = { () => {this.props.goTo("Customers");} }>
                                    <i className="fas fa-user" alt="Customers" title="Customers"></i>
                                </li>  
                            }

                            { (this.props.state.myTypeUser==='1')      
                            &&  
                                <>       
                                    <li className="main-list" onClick = { () => {this.props.goTo("Legislators");} }>
                                        <i className="fas fa-gavel" alt="Legislator" title="Legislator"></i>
                                    </li> 
                                    <li className="main-list" onClick = { () => {this.props.goTo("Technicians");} }>
                                        <i className="fas fa-user-astronaut" alt="Technician" title="Technician"></i>
                                    </li>
                                </>                           
                            }

                            { (this.props.state.myTypeUser==='1' 
                            || this.props.state.myTypeUser==='4')      
                            &&
                                <li className="main-list" onClick = { () => {this.props.goTo("Bridges");} }>
                                    <i className="fas fa-sitemap" alt="Bridge" title="Bridge"></i>
                                </li>            
                            }

                            { (this.props.state.myTypeUser==='1' 
                            || this.props.state.myTypeUser==='4')    
                            &&
                                <li className="main-list" onClick = { () => {this.props.goTo("Measures");} }>
                                    <i className="fas fa-chart-bar" alt="Measure" title="Measure"></i>
                                </li>
                            }
              

                            {(this.props.state.customerContractAddress !== null)
                            &&                              
                            <li className="main-list" onClick = { () => {this.props.goTo("Services");} }>
                                <i className="fas fa-concierge-bell" title="Service"></i>
                            </li>}

                            {(this.props.state.customerContractAddress !== null)
                            &&                             
                            <li className="main-list" onClick = { () => {this.props.goTo("Alerts");} }>
                                <i className="fas fa-exclamation-triangle" title="Alert"></i>
                            </li>
                            }

                            <li className="main-list">
                                <span className="address-btn">{this.showMyContract()}</span>
                            </li>
                            <li className="main-list">
                                <span className="address-btn">{this.showMyAddress()}</span>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}

                                    