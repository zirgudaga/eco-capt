import React from 'react';

import "./InfoRule.css";
import { hexToString } from '../../../utilsEco.js';

export default class InfoRule extends React.Component {

    render() {
        let { myRule } = this.props;

        return (
            <div className="rule-info">
                <p>Nom du seuil : <span className="rule-info-details">{myRule.description}</span></p>
                <p>Version : <span className="rule-info-details">{hexToString(myRule.version)}</span> </p>
                <p>Code Alerte : <span className="rule-info-details">{hexToString(myRule.codeAlert)}</span> </p>
                <p>Seuil d'alerte : <span className="rule-info-details">{hexToString(myRule.valueAlert)}</span> </p>
                <p>Numero de service : <span className="rule-info-details">{myRule.serviceId}</span> </p>
                <p>Adresse du créateur : <span className="rule-info-details">{myRule.legislatorAddress}</span> </p>
            </div>
        );      
    }
}