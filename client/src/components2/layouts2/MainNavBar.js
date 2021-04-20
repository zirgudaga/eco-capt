import React from 'react';
import "./MainNavBar.css";

export default class MainNavBar extends React.Component {

    showAddress = () => {      
        if(this.props.state.accounts !== null){
  
            return this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4);
        } 
        else{
            return 'Waiting';
        }       
    }

    render() {
        return ( 
            <header className="welcome-navbar">
                <div className="wrap">
                        <a href="."><img width="250" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                        <nav>
                            <ul>
                                <li className="main-list">
                                    <a onClick = { () => {this.props.goTo("Service");} }>
                                    Services
                                    </a>
                                </li>
                                <li className="main-list">
                                    <a onClick = { () => {this.props.goTo("Alert");} }>
                                    Alertes
                                    </a>
                                </li>
                                <li className="main-list">
                                    <span className="address-btn">{this.showAddress()}</span>
                                </li>
                            </ul>
                        </nav>
                    </div>
            </header>
        );
    }
}