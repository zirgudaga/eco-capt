import React from 'react';

import {fakeAlert} from '../../utilsEco.js';

export default class FocusAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listALert: [],
            currentAlertFake: 0,
        };        
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 1000);
    }

    refresh = () => {
       this.setAlertFocus(this.props.myAlert.alertId);
    }
    
    setAlertFocus = async (alertId) => {
        let { contract } = this.props.state;
        let { selectedAlert, listAlerts } = this.state;
        selectedAlert = alertId;
        listAlerts = await contract.methods.getAllAlerts(alertId).call();
        this.setState({ listAlerts });  
    };   
    
    showAlert = () => {
        if ((this.state.listAlerts[0] !== undefined) && (this.state.listAlerts[0].length>0)){
            return (
                this.state.listAlerts[0].map((alert, index) => (
                    <div className="" key={"alertKey"+index}>{alert}</div>       
                ))
            );
        }
    }

    addAlert = async () => {
        const { accounts, contract, web3 } = this.props.state;
        let {currentAlertFake } = this.state;

        let alertId=this.props.myAlert.alertId;

        let header, body;

        [header, body] = fakeAlert(currentAlertFake, this.props.myAlert); 
        currentAlertFake++;
        this.setState({ currentAlertFake });

        await contract.methods.addAlert(
            alertId,
            header,  
            body
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New alert added !");
                            }
                        }
                    )
                }
            }
        );  
    };    



    render() {
        return (
            <div className="focus-alert-body">
                <b>{this.props.myAlert.description}</b>

                <CardGraph myAlert={this.props.myAlert} myAlerts={this.state.listAlerts}/>
                <AlertInfo myAlert={this.props.myAlert}/>

                <button type="button" className="focus-alert-cta" 
                    onClick= { () => this.addAlert() }>New alert
                </button> 

            </div>
        );      
    }
}