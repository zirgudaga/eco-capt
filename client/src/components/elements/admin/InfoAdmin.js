import React from 'react';

import "./InfoAdmin.css";

export default class InfoAdmin extends React.Component {

    render() {

        let { myClient } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="admin-info">
                <p>Nom du Master : <span className="admin-info-details">{myClient.description}</span></p>
                <p>Adresse du Master : <span className="admin-info-details">{myClient.clientAddress===address0?"En attente":myClient.clientAddress}</span></p>
                <p>Adresse du contrat : <span className="admin-info-details">{myClient.contractAddress===address0?"En attente":myClient.contractAddress}</span></p>
                <p>Numéro de siret : <span className="admin-info-details">{myClient.siretNumber}</span></p>
            </div>
        );      
    }
}