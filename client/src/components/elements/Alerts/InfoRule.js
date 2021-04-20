import React from 'react';

import "./InfoRule.css";

export default class InfoRule extends React.Component {

    render() {
        
        let { myRule } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="rule-info">
                <p>Nom du seuil : <span className="rule-info-details">{myRule.description}</span></p>
                
            </div>
        );      
    }
}