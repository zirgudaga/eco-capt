import React from 'react';
import "./MainNavBar.css";

export default class MainNavBar extends React.Component {

    showAddress = () => {      
        if(this.props.state.accounts !== null){

            return this.props.state.accounts[0].substr(0,5)+'...'+this.props.state.accounts[0].substr(-4);
        } 
        else{

            return "Waiting...";
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
                                    {(this.props.state.accounts !== null) 
                                    ?<svg key="connectOn" className="svg-inline--fa fa-check-circle fa-w-16" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="check-circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"></path></svg>
                                    :<svg key="connectOff" className="svg-inline--fa fa-hourglass-half fa-w-12" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="hourglass-half" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 384 512" data-fa-i2svg=""><path fill="currentColor" d="M360 0H24C10.745 0 0 10.745 0 24v16c0 13.255 10.745 24 24 24 0 90.965 51.016 167.734 120.842 192C75.016 280.266 24 357.035 24 448c-13.255 0-24 10.745-24 24v16c0 13.255 10.745 24 24 24h336c13.255 0 24-10.745 24-24v-16c0-13.255-10.745-24-24-24 0-90.965-51.016-167.734-120.842-192C308.984 231.734 360 154.965 360 64c13.255 0 24-10.745 24-24V24c0-13.255-10.745-24-24-24zm-75.078 384H99.08c17.059-46.797 52.096-80 92.92-80 40.821 0 75.862 33.196 92.922 80zm.019-256H99.078C91.988 108.548 88 86.748 88 64h208c0 22.805-3.987 44.587-11.059 64z"></path></svg>        
                                    }
                                </li>
                            </ul>
                        </nav>
                    </div>
            </header>
        );
    }
}
    
                                    