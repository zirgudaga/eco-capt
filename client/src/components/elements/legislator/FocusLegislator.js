import React from 'react';

import InfoLegislator from './InfoLegislator.js';

import "./FocusLegislator.css";

export default class FocusLegislator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onOff: false,
            elementOnOff: null,
        };        
    }

    affActive = () => {
        if(this.props.myElement.isActive){
            return (<i className="fas fa-toggle-on" key="fa-toggle-on"></i>); 
        }else{       
            return (<i className="fas fa-toggle-off" key="fa-toggle-off"></i>);
        }
    }
    
    toggleLegislator = async () => {
        
        const { accounts, contract } = this.props.state;
        await contract.methods.toggleService(
            this.props.myLegislator.customerId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});     
                 
    }


    render() {
        return (
            <div className="focus-body">
                            
                <b>{this.props.myElement.description}</b><span onClick= { () => this.toggleLegislator() }>{this.affActive()}</span>

                <InfoLegislator 
                    myElement={this.props.myElement}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoLegislator>

                <button type="button" className="focus-cta" 
                    onClick= { () => this.props.addElement() }>UPDATE
                </button> 


            </div>
        );      
    }
}