import React from 'react';
import "./Home.css";
import { Link } from "react-router-dom";

export default class Home extends React.Component {
    render() {
        return (
            <div className="home">
                <main className="bg-gray-900">
                    <div className="background-image" id="animate-area" style={{
                        backgroundImage: `url("/clouds.png")`,
                    }}>
                    </div>
                    <div className="wrap">
                        <div className="slogan">
                            <h1>Mieux capter pour construire vrai</h1>
                            <p>Être honnête n'a jamais été aussi simple</p>
                            <button className="cta">
                            <Link to="/appClient">Start using</Link>
                            </button>
                        </div>
                    </div>
                </main>  
            </div>
        )
    }
}