import React from 'react';

import InfoClient from './InfoClient.js';

import "./FocusClient.css";

export default class FocusClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            onOff: false,
            elementOnOff: null,
            ecpAmount :0,
        };        
    }

    affActive = () => {
        if(this.props.myElement.isActive){
            return (<i className="fas fa-toggle-on" key="fa-toggle-on"></i>); 
        }else{       
            return (<i className="fas fa-toggle-off" key="fa-toggle-off"></i>);
        }
    }
    

    affCurrentAmount = () => {
        return (this.props.ecpAmount+" - ECP");
    }

    toggleCustomer = async () => {
        const { accounts, ledgerContract } = this.props.state;
        const { myElement } = this.props;

        if(this.props.state.myTypeUser!=='1')
            return;

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
                 <div className="focus-header">
                    <div><b>{this.props.myElement.description}</b><span onClick= { () => this.toggleCustomer() }>{this.affActive()}</span></div>
                </div>
                    {this.props.state.myTypeUser==1
                    &&
                    <div className="focus-token">
                        <p className="focus-header-address">Your current balance is : </p>
                        <div className="focus-token-align">
                            <img className="focus-token-ecp" src="./ECP.png" alt="ecp-token" />
                            <p>{this.state.ecpAmount} ECP</p>
                            <button className="focus-token-cta">add 100 tokens</button>
                        </div>
                    </div>
                    }
                <InfoClient 
                    myElement={this.props.myElement}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoClient>

                {(this.props.state.myTypeUser==='1') &&
                    <button type="button" className="focus-cta" 
                        onClick= { () => this.props.addElement() }>UPDATE
                    </button> 
                }

            </div>
        );      
    }
}