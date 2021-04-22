import React from 'react';

import "./InfoLegislator.css";

export default class InfoLegislator extends React.Component {

    render() {

        let { myClient } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="legislator-info">
                <p>Nom du legislator : <span className="legislator-info-details">{myClient.description}</span></p>
                <p>Adresse du legislator : <span className="legislator-info-details">{myClient.clientAddress===address0?"En attente":myClient.clientAddress}</span></p>
                <p>Adresse du contrat : <span className="legislator-info-details">{myClient.contractAddress===address0?"En attente":myClient.contractAddress}</span></p>
                <p>Numéro de siret : <span className="legislator-info-details">{myClient.siretNumber}</span></p>
            </div>
        );      
    }
}