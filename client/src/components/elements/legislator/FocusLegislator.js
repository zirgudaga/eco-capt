import React from 'react';

import InfoLegislator from './InfoLegislator.js';

import "./FocusLegislator.css";

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
    
    toggleLegislator = async () => {
        console.log("Toggle Legislator");
        /*
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.toggleService(
            this.props.myClient.clientId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});     
        */         
    }


    render() {
        return (
            <div className="focus-legislator-body">
                            
                <b>{this.props.myClient.description}</b><span onClick= { () => this.toggleLegislator() }>{this.affActive()}</span>

                <InfoLegislator myClient={this.props.myClient}/>

                <button type="button" className="focus-legislator-cta" 
                    onClick= { () => this.props.goContract(this.props.myClient.contractAddress) }>Focus this contract
                </button> 


            </div>
        );      
    }
}