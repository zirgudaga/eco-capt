import React from 'react';

import "./InfoLegislator.css";

export default class InfoLegislator extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Legislator's name : <span className="info-details">{myElement.description}</span></p>
                <p>Legislator's address : <span className="info-details">{myElement.legislatorAddress===address0?"En attente":myElement.legislatorAddress}</span></p>
                <p>Siret number : <span className="info-details">{myElement.siretNumber}</span></p>
            </div>
        );      
    }
}