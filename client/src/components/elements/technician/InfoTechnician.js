import React from 'react';

import "./InfoTechnician.css";

export default class InfoTechnician extends React.Component {

    render() {

        let { myClient } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="technician-info">
                <p>Nom du technician : <span className="technician-info-details">{myClient.description}</span></p>
                <p>Adresse du technician : <span className="technician-info-details">{myClient.clientAddress===address0?"En attente":myClient.clientAddress}</span></p>
                <p>Adresse du technician : <span className="technician-info-details">{myClient.contractAddress===address0?"En attente":myClient.contractAddress}</span></p>
            </div>
        );      
    }
}