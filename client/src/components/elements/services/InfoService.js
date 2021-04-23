import React from 'react';

import "./InfoService.css";
import { hexToString } from '../../../utilsEco.js';

export default class InfoService extends React.Component {

    render() {


        let { myService } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="service-info">
                <p>Nom du service : <span className="service-info-details">{myService.description}</span></p>
                <p>Nombre de rapports : <span className="service-info-details">{myService.measureIdCounter._value}</span></p>
                <p>Type de mesure : <span className="service-info-details">{hexToString(myService.measureType)}</span></p>
                <p>Fréquence des mesures : <span className="service-info-details">Toutes les {myService.nbTime} {hexToString(myService.timeCode)}</span></p>
                <p>Adresse du bridge : <span className="service-info-details">{myService.bridgeAddress===address0?"En attente":myService.bridgeAddress}</span></p>
                <p>Adresse du législateur : <span className="service-info-details">{myService.legislatorAddress===address0?"En attente":myService.legislatorAddress}</span></p>
                <p>Adresse du technicien : <span className="service-info-details">{myService.techMasterAddress===address0?"En attente":myService.techMasterAddress}</span></p>
            </div>
        );      
    }
}