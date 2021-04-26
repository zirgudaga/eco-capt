import React from 'react';

import "./InfoTechnician.css";

export default class InfoTechnician extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Technician's name : <span className="info-details">{myElement.description}</span></p>
                <p>Technician's address : <span className="info-details">{myElement.technicianAddress===address0?"En attente":myElement.technicianAddress}</span></p>
                <p>Siret number : <span className="info-details">{myElement.siretNumber}</span></p>
            </div>
        );      
    }
}