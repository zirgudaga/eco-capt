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

        console.log(myService);

        return (
            <div>
                <b>{myService.description}</b>
                <p></p>

            </div>
        );      
    }
}