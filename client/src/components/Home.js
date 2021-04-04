import React from 'react';
import "./Home.css";

export default class Home extends React.Component {
    render() {
        return (
            <main className="bg-gray-900">
                <div className="background-image" id="animate-area" style={{
                    backgroundImage: `url("/clouds.png")`,
                }}>
                </div>
                <div className="wrap">
                    <div className="m-auto">
                        <div className="text-center text-white">
                            <h1>Mieux capter pour construire vrai</h1>
                            <p>Être honnête n'a jamais été aussi simple</p>
                            <button className="cta">
                                start using
                            </button>
                        </div>
                    </div>
                </div>
            </main>  
        )
    }
}