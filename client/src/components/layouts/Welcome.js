import React from 'react';
import "./Welcome.css";

import { Link } from "react-router-dom";

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="homepage">
                <main className="welcome-main">
                    <div className="background-image" id="animate-area" style={{
                        backgroundImage: `url("/clouds.png")`,
                    }}>
                    </div>
                    <div className="welcome-card">
                        <div className="slogan">
                            <h1>Fully capture the real world</h1>
                            <p>Being honest has never been easier</p>
                            <Link className="welcome-cta" to="/app">Start using</Link>
                        </div>
                    </div>
                </main>  
            </div>
        )
    }
}