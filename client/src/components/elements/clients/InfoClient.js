import React from 'react';

import "./InfoClient.css";

export default class InfoClient extends React.Component {

    render() {

        let { myClient } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="client-info">
                <p>Nom du client : <span className="client-info-details">{myClient.description}</span></p>
                <p>Adresse du client : <span className="client-info-details">{myClient.clientAddress===address0?"En attente":myClient.clientAddress}</span></p>
                <p>Adresse du contrat : <span className="client-info-details">{myClient.contractAddress===address0?"En attente":myClient.contractAddress}</span></p>
                <p>Numéro de siret : <span className="client-info-details">{myClient.siretNumber}</span></p>
            </div>
        );      
    }
}