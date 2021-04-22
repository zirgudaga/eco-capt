import React from 'react';

import {fakeAlert, _alertToObject_V_00_01_00} from '../../../utilsEco.js';

import InfoRule from './InfoRule.js';

import "./FocusRule.css";

export default class FocusRule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listALert: [],
        };        
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
       this.setAlertFocus();
    }
  
    setAlertFocus = async () => {
        let { contract } = this.props.state;
        let { listAlerts } = this.state;

        contract.getPastEvents('AlertReceive', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
        .then(async (myEvents) => {
            listAlerts = [];
            let index=0;
            for(let myEvent of myEvents){
                if(myEvent.returnValues['_ruleId'] === this.props.myRule.ruleId){
                    listAlerts[index] = myEvent.returnValues['_alert'];
                    index++;
                }       
            }
            this.setState({ listAlerts });  
        });
    };   
    
    showAllAlert = () => {
        if ((this.state.listAlerts !== undefined) && (this.state.listAlerts.length>0)){
            return (
                this.state.listAlerts.map((alert, index) => (
                    this.showAlert(alert, index)      
                ))
            );
        }
    };

    showAlert = (hex, index) => {
        let objet = _alertToObject_V_00_01_00(hex);
        return (
            <div className="" key={"alertKey"+index}>{objet.date} - {objet.val}</div>
        );
    };

    addAlert = async () => {
        const { accounts, contract, web3 } = this.props.state;

        let body = fakeAlert(this.props.myRule.ruleId); 

        await contract.methods.addAlert(
            this.props.myRule.serviceId,
            this.props.myRule.ruleId,  
            body
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    /*
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New alert added !");
                            }
                        }
                    )
                    */
                }
            }
        );  
    };    

    render() {
        return (
            <div className="focus-rule-body">
                <b>{this.props.myRule.description}</b>

                {this.showAllAlert()}

                <InfoRule myRule={this.props.myRule}/>

                <button type="button" className="focus-rule-cta" 
                    onClick= { () => this.addAlert() }>New alert
                </button> 

            </div>
        );      
    }
}