import React from 'react';

import InfoTechnician from './InfoTechnician.js';

import "./FocusTechnician.css";

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
    
    toggleTechnician = async () => {
        console.log("Toggle Technician");
        /*
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.toggleService(
            this.props.myClient.clientId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});     
        */         
    }


    render() {
        return (
            <div className="focus-technician-body">
                            
                <b>{this.props.myClient.description}</b><span onClick= { () => this.toggleClient() }>{this.affActive()}</span>

                <InfoTechnician myClient={this.props.myClient}/>

                <button type="button" className="focus-technician-cta" 
                    onClick= { () => this.props.goContract(this.props.myClient.contractAddress) }>Focus this contract
                </button> 


            </div>
        );      
    }
}