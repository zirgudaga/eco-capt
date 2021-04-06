import React from 'react';
import "./NavBar.css";
import { Link } from "react-router-dom";


export default class NavBar extends React.Component {
    render() {
        return (
            <header className="main-header">
                <div className="wrap">
                    <a href="."><img width="208" height="128" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    <nav>
                        <ul>
                            <li><Link to="/app">App</Link></li>
                            <li><a href=".">About</a></li>
                            <li><a href=".">Contact us</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}