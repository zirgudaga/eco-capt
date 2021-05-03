import React from 'react';

import InfoTechnician from './InfoTechnician.js';

import "./FocusTechnician.css";

export default class FocusTechnician extends React.Component {

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
    
    toggleTechnician = async () => {
        const { accounts, ledgerContract } = this.props.state;
        const { myElement } = this.props;

        if(this.props.state.myTypeUser!=='1')
            return;

        await ledgerContract.methods.setTechMaster(
            myElement.description.trim(),
            myElement.technicianAddress.trim(),
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
                            
                <b>{this.props.myElement.description}</b><span onClick= { () => this.toggleTechnician() }>{this.affActive()}</span>

                <InfoTechnician 
                    myElement={this.props.myElement}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoTechnician>

                <button type="button" className="focus-cta" 
                    onClick= { () => this.props.addElement() }>UPDATE
                </button> 
                
            </div>
        );      
    }
}