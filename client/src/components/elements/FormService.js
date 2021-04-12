import React from 'react';
import "./FormService.css";
import {stringToHex} from '../../utilsEco.js';
import MySelect from '../elements/MySelect.js';
import MyNotif from '../elements/MyNotif.js';

export default class FormService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addServiceVersion: '',
            addServiceMeasureType: '',
            addServiceTimeType: '',
            errorMessage: '',
        };
    }

    addService = async () => {
        let { addServiceVersion, addServiceMeasureType, addServiceTimeType, errorMessage } = this.state;

        let context = this;

        if(addServiceVersion === '' || 
        addServiceMeasureType === '' || 
        addServiceTimeType === '' || 
        this.newServiceDescription.value.trim() === '' ||
        this.newServiceNbTime.value <= '0'
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
        await contract.methods.addService(
            '0x'+stringToHex(addServiceVersion), 
            this.newServiceDescription.value.trim(),
            '0x'+stringToHex(addServiceMeasureType), 
            '0x'+stringToHex(addServiceTimeType),            
            this.newServiceNbTime.value        
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                context.props.close();                
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New service added !");
                            }
                        }
                    )
                }
            }
        ); 
    };

    handleMySelect = async (selectedName, selectedValue) => {
        let { addServiceVersion, addServiceMeasureType, addServiceTimeType } = this.state;

        switch(selectedName){
            case 'addServiceVersion': addServiceVersion = selectedValue; break;
            case 'addServiceMeasureType': addServiceMeasureType = selectedValue; break;
            case 'addServiceTimeType': addServiceTimeType = selectedValue; break;            
            default: console.log('ERR - Select not found'); 
        }      

        this.setState({ addServiceVersion, addServiceMeasureType, addServiceTimeType });         
    };  

    render() {
        return (
            <div className="form-newservice-body">
                <span className="form-service-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contract={this.props.state.contractTarget}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-newservice-label">
                        <label>
                            Description du service
                        </label>
                        <input type="text" name="newServiceDescription" className="form-newservice-detail" placeholder="Nouveau service"
                            ref={(input) => { 
                                this.newServiceDescription = input
                            }}
                        />
                    </div>

                    <div className="form-newservice-label">
                        <label>
                            Version du service
                        </label>
                        <MySelect 
                            myName="addServiceVersion" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>


                    <div className="form-newservice-label">
                        <label>
                            Measure du service
                        </label>
                        <MySelect 
                            myName="addServiceMeasureType" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>

                    <div className="form-newservice-label">
                        <label>
                            Fréquence
                        </label>

                        <input type="number" name="frequency" className="frequency" size="4" className="form-service-input-number" placeholder="1"
                            ref={(input) => { 
                                this.newServiceNbTime = input
                            }}
                        />
                        <MySelect 
                            myName="addServiceTimeType" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>

                    <button type="button" className="form-service-cta" 
                            onClick= { () => this.addService() }>Add service
                    </button> 
    
                </form>

            </div>
        );      
    }
}