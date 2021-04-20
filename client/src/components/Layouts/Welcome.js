import React from 'react';
import "./Welcome.css";

import { Link } from "react-router-dom";

export default class Welcome extends React.Component {
    render() {
        return (
            <div className="home">
                <main className="welcome-main">
                    <div className="background-image" id="animate-area" style={{
                        backgroundImage: `url("/clouds.png")`,
                    }}>
                    </div>
                    <div className="welcome-card">
                        <div className="slogan">
                            <h1>Mieux capter pour construire vrai</h1>
                            <p>Être honnête n'a jamais été aussi simple</p>
                            <button className="welcome-cta">
                            <Link to="/appClient">Start using</Link>
                            </button>
                        </div>
                    </div>
                </main>  
            </div>
        )
    }
}