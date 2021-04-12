import React from 'react';
import CardGraph from './CardGraph.js';
import "./HomeService.css";

export default class HomeService extends React.Component {

    render() {
        return (
            <div className="home-service-flex">
                <div className="home-service-main">
                    <h1 className="home-service-title">Mes services</h1>
                </div>
                <CardGraph />
            </div>
        );      
    }
}