import React from 'react';

import "./InfoLegislator.css";

export default class InfoLegislator extends React.Component {

    render() {

        let { myLegislator } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        console.log(myLegislator);

        return (
            <div className="legislator-info">
                <p>Nom du legislator : <span className="legislator-info-details">{myLegislator.description}</span></p>
                <p>Adresse du legislator : <span className="legislator-info-details">{myLegislator.legislatorAddress}</span></p>
                <p>Numéro de siret : <span className="legislator-info-details">{myLegislator.siretNumber}</span></p>
            </div>
        );      
    }
}