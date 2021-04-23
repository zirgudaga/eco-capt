import React from 'react';

import InfoBridge from './InfoBridge.js';

import "./FocusBridge.css";

export default class FocusBridge extends React.Component {

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
    
    toggleBridge = async () => {
        const { accounts, ledgerContract } = this.props.state;
        const { myElement } = this.props;

        await ledgerContract.methods.setBridge(
            myElement.description,
            myElement.url,
            myElement.info,
            myElement.bridgeAddress,
            myElement.techMasterAddress,             
            !myElement.isActive       
        ).send({ from: accounts[0] },
            async (erreur, tx) => {               
                if(tx){

                }
            }
        ); 
    }

    affUpdate = () => {

        if(this.props.state.myTypeUser==='1'){
            return (<button type="button" className="focus-cta" 
                onClick= { () => this.props.addElement() }>UPDATE
            </button>); 
        }

        if(this.props.state.myTypeUser==='4' && this.props.myElement.techMasterAddress===this.props.state.accounts[0])
        {
            return (<button type="button" className="focus-cta" 
                onClick= { () => this.props.addElement() }>UPDATE
            </button>); 
        }
    }

    render() {
        return (
            <div className="focus-body">
                            
                <b>{this.props.myElement.description}</b><span onClick= { () => this.toggleBridge() }>{this.affActive()}</span>

                <InfoBridge 
                    myElement={this.props.myElement}
                    goContract={(addr) => {this.props.goContract(addr)}} 
                ></InfoBridge>

                {this.affUpdate()}

            </div>
        );      
    }
}