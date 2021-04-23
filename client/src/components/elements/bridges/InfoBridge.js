import React from 'react';

import "./InfoBridge.css";

export default class InfoBridge extends React.Component {

    render() {

        let { myElement } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="info">
                <p>Name : <span className="info-details">{myElement.description}</span></p>
                <p>URL : <span className="info-details">{myElement.url}</span></p>
                <p>Info : <span className="info-details">{myElement.info}</span></p>
                <p>Adresse du bridge : <span className="info-details">{myElement.bridgeAddress===address0?"En attente":myElement.bridgeAddress}</span></p>
                <p>Adresse du techmaster : <span className="info-details">{(myElement.techMasterAddress===address0)?"En attente":myElement.techMasterAddress}</span></p>
            </div>
        );      
    }
}