import React from 'react';
import "./WelcomeNavBar.css";

import { Link } from "react-router-dom";


export default class WelcomeNavBar extends React.Component {
    render() {
        return (
            <header className="welcome-navbar">
                <div className="wrap">
                    <a href="."><img width="250" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    <nav>
                        <ul>
                            <li className="welcome-list"><Link to="/appClient">App Client</Link></li>
                            <li className="welcome-list"><Link to="/appTesteur">App Testeur</Link></li>
                            
                            <li className="welcome-list"><a href=".">About</a></li>
                            <li className="welcome-list"><a href=".">Contact us</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}
