import React from 'react';

import "./InfoTechnician.css";

export default class InfoTechnician extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Nom du technician : <span className="info-details">{myElement.description}</span></p>
                <p>Adresse du technician : <span className="info-details">{myElement.technicianAddress===address0?"En attente":myElement.technicianAddress}</span></p>
                <p>Adresse du contrat : <span className="info-details">{(myElement.contractAddress===address0)
                ?"En attente"
                :<>{myElement.contractAddress}<i className="fas fa-clipboard" onClick={()=> {this.props.goContract(this.props.myElement.contractAddress)}}></i></>
                }
                </span></p>
                <p>Numéro de siret : <span className="info-details">{myElement.siretNumber}</span></p>
            </div>
        );      
    }
}