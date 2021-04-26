import React from 'react';

import "./InfoMeasure.css";

export default class InfoMeasure extends React.Component {

    render() {

        let { myElement } = this.props;

        return (
            <div className="info">
                <p>Code measure : <span className="info-details">{myElement.codeMeasure}</span></p>
                <p>Name measure : <span className="info-details">{myElement.description}</span></p>
                <p>Info measure : <span className="info-details">{myElement.info}</span></p>
            </div>
        );      
    }
}