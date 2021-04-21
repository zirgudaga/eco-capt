import React from 'react';

import "./InfoRule.css";

export default class InfoRule extends React.Component {

    render() {
        let { myRule } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="rule-info">
                <p>Nom du seuil : <span className="rule-info-details">{myRule.description}</span></p>
                <p>Version : <span className="rule-info-details">{myRule.version}</span> </p>
                <p>Code Alerte : <span className="rule-info-details">{myRule.codeAlert}</span> </p>
                <p>Seuil d'alerte : <span className="rule-info-details">{myRule.valueAlert}</span> </p>
                <p>Numero de service : <span className="rule-info-details">{myRule.serviceId}</span> </p>
                <p>Adresse du créateur : <span className="rule-info-details">{myRule.legislatorAddress}</span> </p>
            </div>
        );      
    }
}