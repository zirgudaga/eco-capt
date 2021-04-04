import React from 'react';

export default class NavBar extends React.Component {
    render() {
        return (
            <header className="main-header">
                <div className="wrap">
                    <a href="."><img width="208" height="128" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    <nav>
                        <ul>
                            <li><a href=".">App</a></li>
                            <li><a href=".">About</a></li>
                            <li><a href=".">Contact us</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}