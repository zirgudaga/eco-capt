import React from 'react';

import "./InfoBridge.css";

export default class InfoBridge extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Nom du bridge : <span className="info-details">{myElement.description}</span></p>
                <p>Adresse du bridge : <span className="info-details">{myElement.bridgeAddress===address0?"En attente":myElement.bridgeddress}</span></p>
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