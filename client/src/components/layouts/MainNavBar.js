import React from 'react';
import "./MainNavBar.css";

export default class MainNavBar extends React.Component {

    showMyAddress = () => {      
        if(this.props.state.accounts !== null){
            return <span><i key="fa-user" className="fas fa-user"></i>{this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4)}<i key="fa-check-circle" className="fas fa-check-circle"></i></span>;
        } 
        else{
            return <span>Waiting<i key="fa-hourglass-half" className="fas fa-hourglass-half"></i></span>;
        }       
    }

    showMyContract = () => {      
        if(this.props.state.customerContractAddress !== null){

            if(this.props.state.myTypeUser == 2){
                return <span><i key="fa-clipboard" className="fas fa-clipboard"></i>{this.props.state.customerContractAddress.substr(0,5)+'...'+this.props.state.customerContractAddress.substr(-4)}
                </span>;                
            }else if(this.props.state.myTypeUser != -1){
                return <span><i key="fa-clipboard" className="fas fa-clipboard"></i>{this.props.state.customerContractAddress.substr(0,5)+'...'+this.props.state.customerContractAddress.substr(-4)}
                <span className="x-close" onClick={()=>this.props.contractClose()}>X</span>
                </span>;
            }   
        } 
        else{
            return <span>No contract selected...</span>;
        }       
    }    

    render() {
        return ( 
            <header className="welcome-navbar">
                <div className="wrap">
                    <a href="."><img width="250" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    <nav>
                        <ul>


                            {(this.props.state.myTypeUser==1)
                            &&
                            <li className="main-list">
                                <a onClick = { () => {this.props.goTo("Client");} }>
                                Clients
                                </a>
                            </li>
                            }

                            {(this.props.state.customerContractAddress !== null)
                            &&                              
                            <li className="main-list">
                                <a onClick = { () => {this.props.goTo("Service");} }>
                                Services
                                </a>
                            </li>}

                            {(this.props.state.customerContractAddress !== null)
                            &&                             
                            <li className="main-list">
                                <a onClick = { () => {this.props.goTo("Alert");} }>
                                Alertes
                                </a>
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

                                    