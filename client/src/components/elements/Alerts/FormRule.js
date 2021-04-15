import React from 'react';
import "./FormRule.css";
import {stringToHex} from '../../../utilsEco.js';
import MySelect from '../MySelect.js';
import MySelectEth from '../MySelectEth.js';
import MyNotif from '../MyNotif.js';

export default class FormAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addSeuilVersion: '',
            addSeuilCode: '',
            addService: '',
            errorMessage: '',
        };
    }

    addAlertConfig = async () => {
        let { addSeuilVersion, addSeuilCode, addService, errorMessage } = this.state;

        if(addSeuilVersion === '' || 
        addSeuilCode === '' || 
        addService === '' ||
        this.newSeuilDescription.value.trim() === '' ||
        this.newSeuilLevel.value <= '0'
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
        await contract.methods.addAlertConfig(
            '0x'+stringToHex(addSeuilVersion), 
            addService,
            this.newSeuilDescription.value.trim(),
            '0',
            '0',
            '0x'+stringToHex(addSeuilCode),             
            '0x'+stringToHex(("00000000"+this.newSeuilLevel.value).substr(-8))
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    /*
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New Alert Config added !");
                            }
                        }
                    )
                    */
                }
            }
        ); 
    };

    handleMySelect = async (selectedName, selectedValue) => {
        let { addSeuilVersion, addSeuilCode, addService } = this.state;

        switch(selectedName){
            case 'addSeuilVersion': addSeuilVersion = selectedValue; break;
            case 'addSeuilCode': addSeuilCode = selectedValue; break;   
            case 'addService': addService = selectedValue; break;     
            default: console.log('ERR - Select not found'); 
        }      

        this.setState({ addSeuilVersion, addSeuilCode, addService });         
    };  

    render() {
        return (
            <div className="form-rule-body">
                <span className="form-rule-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contract={this.props.state.contractTarget}
                    errorMessage={this.state.errorMessage}    
                />

                    <form>                           
                        <div className="form-rule-label">
                            <label>
                                Description du seuil
                            </label>
                            <input type="text" id="newSeuilDescription" className="form-rule-input" 
                                ref={(input) => { 
                                    this.newSeuilDescription = input
                                }}
                            />
                        </div>
                        
                        <div className="form-rule-label">
                            <label>
                                Version du seuil
                            </label>
                            <MySelect 
                                myName="addSeuilVersion" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Service concerné
                            </label>
                            <MySelectEth 
                                myName="addService" 
                                state={this.props.state}
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Code du seuil
                            </label>
                            <MySelect 
                                myName="addSeuilCode" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Valeur du seuil
                            </label>

                            <input type="number" size="4" className="form-rule-input" id="newSeuilLevel" 
                                ref={(input) => { 
                                    this.newSeuilLevel = input
                                }}
                            />
                        </div>

                        <button type="button" className="form-service-cta" 
                            onClick= { () => this.addAlertConfig() }>Add rule
                        </button> 
        
                    </form>
            </div>
        );      
    }
}