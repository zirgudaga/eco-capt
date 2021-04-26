import React from 'react';
import "./FormRule.css";
import {stringToHex} from '../../../utilsEco.js';
import MySelect from '../MySelect.js';
import MySelectEth from '../MySelectEth.js';
import MyNotif from '../MyNotif.js';

export default class FormRule extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addSeuilVersion: '',
            addSeuilCode: '',
            addService: '',
            errorMessage: '',
        };
    }

    addRule = async () => {
        let { addSeuilVersion, addSeuilCode, addService, errorMessage } = this.state;

        let context = this;

        if(addSeuilVersion === '' || 
        addSeuilCode === '' || 
        addService === '' ||
        this.newSeuilDescription.value.trim() === '' ||
        this.newSeuilLevel.value <= '0'
        ){
            errorMessage = "Please fill the form properly!";
            this.setState({ errorMessage });

            setTimeout(()=>{
                errorMessage = "";
                this.setState({ errorMessage });
            },2000);

            return ;
        }

        const { accounts, customerContract } = this.props.state;
        await customerContract.methods.addRule(
            '0x'+stringToHex(addSeuilVersion), 
            addService,
            this.newSeuilDescription.value.trim(),
            '0',
            '0',
            '0x'+stringToHex(addSeuilCode),             
            '0x'+stringToHex(("00000000"+this.newSeuilLevel.value).substr(-8))
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                context.props.close();
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
                    contractAddress={this.props.state.customerContractAddress}
                    errorMessage={this.state.errorMessage}    
                />

                    <form>                           
                        <div className="form-rule-label">
                            <label>
                                Threshold's description
                            </label>
                            <input type="text" id="newSeuilDescription" className="form-rule-input" 
                                ref={(input) => { 
                                    this.newSeuilDescription = input
                                }}
                            />
                        </div>
                        
                        <div className="form-rule-label">
                            <label>
                                Threshold's version
                            </label>
                            <MySelect 
                                myName="addSeuilVersion" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Affected service
                            </label>
                            <MySelectEth 
                                myName="addService" 
                                state={this.props.state}
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Threshold's code
                            </label>
                            <MySelect 
                                myName="addSeuilCode" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="form-rule-label">
                            <label>
                                Threshold's value
                            </label>

                            <input type="number" size="4" className="form-rule-input" id="newSeuilLevel" 
                                ref={(input) => { 
                                    this.newSeuilLevel = input
                                }}
                            />
                        </div>

                        <button type="button" className="form-service-cta" 
                            onClick= { () => this.addRule() }>Add rule
                        </button> 
        
                    </form>
            </div>
        );      
    }
}