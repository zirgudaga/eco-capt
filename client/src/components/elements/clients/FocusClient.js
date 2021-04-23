import React from 'react';

import InfoClient from './InfoClient.js';

import "./FocusClient.css";

export default class FocusService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onOff: false,
            elementOnOff: null,
        };        
    }

    affActive = () => {
        if(this.props.myClient.isActive){
            return (<i className="fas fa-toggle-on" key="fa-toggle-on"></i>); 
        }else{       
            return (<i className="fas fa-toggle-off" key="fa-toggle-off"></i>);
        }
    }
    
    toggleClient = async () => {
        console.log("Toggle Client");
        /*
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.toggleService(
            this.props.myClient.clientId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});     
        */         
    }


    render() {
        return (
            <div className="focus-client-body">
                            
                <b>{this.props.myClient.description}</b><span onClick= { () => this.toggleClient() }>{this.affActive()}</span>

                <InfoClient 
                    myClient={this.props.myClient}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoClient>

                <button type="button" className="focus-client-cta" 
                    onClick= { () => {} }>UPDATE
                </button> 


            </div>
        );      
    }
}