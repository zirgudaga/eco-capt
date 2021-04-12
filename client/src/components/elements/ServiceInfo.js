import React from 'react';

import "./ServiceInfo.css";

export default class ServiceInfo extends React.Component {


    /*IotIdCounter: ["0", _value: "0"]
    alertConfigIdCounter: ["0", _value: "0"]
    alertIdCounter: ["0", _value: "0"]
    bridgeAddress: "0x0000000000000000000000000000000000000000"
    description: "Mon service 2"
    isActive: true
    legislatorAddress: "0x0000000000000000000000000000000000000000"
    measureIdCounter: ["7", _value: "7"]
    measureType: "0x534f4e5f30303031"
    nbTime: "4"
    serviceId: "1"
    techMasterAddress: "0x0000000000000000000000000000000000000000"
    timeCode: "0x6d"
    version: "0x30302e30312e3030"
    */


    render() {

        let { myService } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="service-info">
                <p>Nom du service : <span className="service-info-details">{myService.description}</span></p>
                <p>Type de mesure : <span className="service-info-details">{myService.measureType}</span></p>
                <p>Fréquence des mesures : <span className="service-info-details">Toute les {myService.nbTime} {myService.timeCode}</span></p>
                <p>Adresse du bridge : <span className="service-info-details">{myService.bridgeAddress===address0?"En attente":myService.bridgeAddress}</span></p>
                <p>Adresse du législateur : <span className="service-info-details">{myService.legislatorAddress===address0?"En attente":myService.legislatorAddress}</span></p>
                <p>Adresse du technicien : <span className="service-info-details">{myService.techMasterAddress===address0?"En attente":myService.techMasterAddress}</span></p>

            </div>
        );      
    }
}