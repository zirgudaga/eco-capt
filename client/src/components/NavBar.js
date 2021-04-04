import React from 'react';

export default class NavBar extends React.Component {
    render() {
        return (
            <header className="main-header">
                <div className="wrap">
                    <a><img width="208" height="128" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    <nav>
                        <ul>
                            <li><a>App</a></li>
                            <li><a>About</a></li>
                            <li><a>Contact us</a></li>
                        </ul>
                    </nav>
                </div>
            </header>
        );
    }
}