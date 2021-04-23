import React from 'react';

import InfoClient from './InfoClient.js';

import "./FocusClient.css";

export default class FocusClient extends React.Component {

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
    
    toggleCustomer = async () => {
        const { accounts, ledgerContract } = this.props.state;
        const { myElement } = this.props;

        await ledgerContract.methods.setCustomer(
            myElement.description.trim(),
            myElement.customerAddress.trim(),
            myElement.contractAddress.trim(), 
            myElement.siretNumber.trim(),  
            !myElement.isActive              
        ).send({ from: accounts[0] },
            async (erreur, tx) => {             
                if(tx){

                }
            }
        );          
    }

    render() {
        return (
            <div className="focus-body">
                            
                <b>{this.props.myElement.description}</b><span onClick= { () => this.toggleCustomer() }>{this.affActive()}</span>

                <InfoClient 
                    myElement={this.props.myElement}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoClient>

                <button type="button" className="focus-cta" 
                    onClick= { () => this.props.addElement() }>UPDATE
                </button> 


            </div>
        );      
    }
}