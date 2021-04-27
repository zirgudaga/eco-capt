import React from 'react';
import "./FormService.css";
import {stringToHex} from '../../../utilsEco.js';
import MySelect from '../MySelect.js';
import MySelectEth from '../MySelectEth.js';

import MyNotif from '../MyNotif.js';

export default class FormService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            addServiceVersion: '',
            addMeasureType: '',
            addServiceTimeType: '',
            errorMessage: '',
        };
    }

    addService = async () => {
        let { addServiceVersion, addMeasureType, addServiceTimeType, errorMessage } = this.state;

        let context = this;

        if(addServiceVersion === '' || 
        addMeasureType === '' || 
        addServiceTimeType === '' || 
        this.newServiceDescription.value.trim() === '' ||
        this.newServiceNbTime.value <= '0'
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
        await customerContract.methods.addService(
            '0x'+stringToHex(addServiceVersion), 
            this.newServiceDescription.value.trim(),
            '0x'+stringToHex(addMeasureType), 
            '0x'+stringToHex(addServiceTimeType),            
            this.newServiceNbTime.value        
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                context.props.close();                
                if(tx){
                    /*
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New service added !");
                            }
                        }
                    )
                    */
                }
            }
        ); 
    };

    handleMySelect = async (selectedName, selectedValue) => {
        let { addServiceVersion, addMeasureType, addServiceTimeType } = this.state;

        switch(selectedName){
            case 'addServiceVersion': addServiceVersion = selectedValue; break;
            case 'addMeasureType': addMeasureType = selectedValue; break;
            case 'addServiceTimeType': addServiceTimeType = selectedValue; break;            
            default: console.log('ERR - Select not found'); 
        }      

        this.setState({ addServiceVersion, addMeasureType, addServiceTimeType });         
    };  

    render() {
        return (
            <div className="form-newservice-body">
                <span className="form-service-close" onClick={()=>this.props.close()}>X</span><br/>

                <MyNotif 
                    contractAddress={this.props.state.customerContractAddress}
                    errorMessage={this.state.errorMessage}    
                />

                <form>
                    <div className="form-newservice-label">
                        <label>
                            Service's description
                        </label>
                        <input type="text" name="newServiceDescription" className="form-newservice-detail" placeholder="Nouveau service"
                            ref={(input) => { 
                                this.newServiceDescription = input
                            }}
                        />
                    </div>

                    <div className="form-newservice-label">
                        <label>
                            Service's version
                        </label>
                        <MySelect 
                            myName="addServiceVersion" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>


                    <div className="form-newservice-label">
                        <label>
                            Service's measure
                        </label>
                        <MySelectEth 
                            state={this.props.state}
                            myName="addMeasureType" 
                            handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                        />
                    </div>

                    <div className="form-newservice-label">
                        <label>
                            Measure's frequency
                        </label>

                        <input type="number" name="frequency" size="4" className="frequenc form-service-input-number" placeholder="1"
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