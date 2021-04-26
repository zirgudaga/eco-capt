import React from 'react';

import "./InfoRule.css";
import { hexToString } from '../../../utilsEco.js';

export default class InfoRule extends React.Component {

    render() {
        let { myRule } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="rule-info">
                <p>Threshold's name : <span className="rule-info-details">{myRule.description}</span></p>
                <p>Version : <span className="rule-info-details">{hexToString(myRule.version)}</span> </p>
                <p>Alert code : <span className="rule-info-details">{hexToString(myRule.codeAlert)}</span> </p>
                <p>Threshold's alert : <span className="rule-info-details">{hexToString(myRule.valueAlert)}</span> </p>
                <p>Service's number : <span className="rule-info-details">{myRule.serviceId}</span> </p>
                <p>Creator's address : <span className="rule-info-details">{myRule.legislatorAddress}</span> </p>
            </div>
        );      
    }
}