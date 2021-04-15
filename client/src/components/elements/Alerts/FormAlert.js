import React from 'react';
import "./FormAlert.css";
import {stringToHex} from '../../utilsEco.js';
import MySelect from './MySelect.js';
import MyNotif from './MyNotif.js';

export default class FormAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addAlertVersion: '',
            addAlertServiceType: '',
            addServiceTimeType: '',
            errorMessage: '',
        };
    }

    addAlert = async () => {
        let { addAlertVersion, addAlertServiceType, addServiceTimeType, errorMessage } = this.state;

        let context = this;

        if(addAlertVersion === '' || 
        addAlertServiceType === '' || 
        addServiceTimeType === '' || 
        this.newAlertDescription.value.trim() === '' ||
        this.newAlertNbTime.value <= '0'
        ){
            errorMessage = "Merci de remplir correctement le formulaire !";
            this.setState({ errorMessage });

            setTimeout(()=>{
                errorMessage = "";
                this.setState({ errorMessage });
            },2000);

            return ;
        }

        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.addAlert(
            '0x'+stringToHex(addAlertVersion), 
            this.newAlertDescription.value.trim(),
            '0x'+stringToHex(addAlertServiceType), 
            '0x'+stringToHex(addServiceTimeType),            
            this.newAlertNbTime.value        
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                context.props.close();                
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New Alert added !");
                            }
                        }
                    )
                }
            }
        ); 
    };

    handleMySelect = async (selectedName, selectedValue) => {
        let { addAlertVersion, addAlertServiceType, addServiceTimeType } = this.state;

        switch(selectedName){
            case 'addAlertVersion': addAlertVersion = selectedValue; break;
            case 'addAlertServiceType': addAlertServiceType = selectedValue; break;
            case 'addServiceTimeType': addServiceTimeType = selectedValue; break;            
            default: console.log('ERR - Select not found'); 
        }      

        this.setState({ addAlertVersion, addAlertServiceType, addServiceTimeType });         
    };  

    render() {
        return (
            <div className="form-newAlert-body">
                <span className="form-Alert-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contract={this.props.state.contractTarget}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-newAlert-label">
                        <label>
                            Description du Alert
                        </label>
                        <input type="text" name="newAlertDescription" className="form-newAlert-detail" placeholder="Nouveau Alert"
                            ref={(input) => { 
                                this.newAlertDescription = input
                            }}
                        />
                    </div>

                    <div className="form-newAlert-label">
                        <label>
                            Version du Alert
                        </label>
                        <MySelect 
                            myName="addAlertVersion" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>


                    <div className="form-newAlert-label">
                        <label>
                            Measure du Alert
                        </label>
                        <MySelect 
                            myName="addAlertServiceType" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>

                    <div className="form-newAlert-label">
                        <label>
                            Fréquence
                        </label>

                        <input type="number" name="frequency" className="frequency" size="4" className="form-Alert-input-number" placeholder="1"
                            ref={(input) => { 
                                this.newAlertNbTime = input
                            }}
                        />
                        <MySelect 
                            myName="addServiceTimeType" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>

                    <button type="button" className="form-Alert-cta" 
                            onClick= { () => this.addAlert() }>Add Alert
                    </button> 
    
                </form>

            </div>
        );      
    }
}