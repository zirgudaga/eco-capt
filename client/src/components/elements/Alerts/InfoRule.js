import React from 'react';

import "./InfoRule.css";

export default class ServiceInfo extends React.Component {

    render() {
        
        let { myRule } = this.props;
        let address0 = "0x0000000000000000000000000000000000000000";

        return (
            <div className="service-info">
                <p>Nom du seuil : <span className="service-info-details">{myRule.description}</span></p>
                
            </div>
        );      
    }
}