import React from 'react';

import "./InfoClient.css";

export default class InfoClient extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Customer's name : <span className="info-details">{myElement.description}</span></p>
                <p>Customer's address : <span className="info-details">{myElement.customerAddress===address0?"En attente":myElement.customerAddress}</span></p>
                <p>Contract's address : <span className="info-details">{(myElement.contractAddress===address0)
                ?"En attente"
                :<>{myElement.contractAddress}<i className="fas fa-clipboard" onClick={()=> {this.props.goContract(this.props.myElement.contractAddress)}}></i></>
                }
                </span></p>
                <p>Siret number : <span className="info-details">{myElement.siretNumber}</span></p>
            </div>
        );      
    }
}