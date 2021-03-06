import React from 'react';
import "./WelcomeNavBar.css";

import { Link } from "react-router-dom";


export default class WelcomeNavBar extends React.Component {
    render() {
        return (
            <header className="welcome-navbar">
                <div className="wrap">
                    <a href="."><img width="250" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    <nav>
                        <ul>
                            <li className="welcome-list"><Link to="/app">App</Link></li>
                            
                            <li className="welcome-list"><a href=".">About</a></li>
                            <li className="welcome-list"><a href=".">Contact us</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}
