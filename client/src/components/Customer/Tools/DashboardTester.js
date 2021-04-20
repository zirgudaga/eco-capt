import React from 'react';
import {stringToHex, fakeMeasure, measureToObject, fakeAlert} from '../../../utilsEco';
import MyNotif from '../../Elements/MyNotif.js';
import MySelect from '../../Elements/MySelect.js';

import "./DashboardTester.css";

export default class DashboardTester extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            listMeasures: [], 
            currentMeasureFake : 0,

            listAlertConfig: [],
            selectedAlertConfig: -1,

            listAlerts: [],


            addServiceVersion: '',
            addServiceMeasureType: '',
            addServiceTimeType: '',

            addSeuilVersion: '',
            addSeuilCode: '',

            errorMessage: '',
        };
    }

    handleMySelect = async (selectedName, selectedValue) => {
        let { addServiceVersion, addServiceMeasureType, addServiceTimeType, addSeuilVersion, addSeuilCode } = this.state;

        switch(selectedName){
            case 'addServiceVersion': addServiceVersion = selectedValue; break;
            case 'addServiceMeasureType': addServiceMeasureType = selectedValue; break;
            case 'addServiceTimeType': addServiceTimeType = selectedValue; break; 

            case 'addSeuilVersion': addSeuilVersion = selectedValue; break; 
            case 'addSeuilCode': addSeuilCode = selectedValue; break; 

            default: console.log('ERR - Select not found'); 
        }

        this.setState({ addServiceVersion, addServiceMeasureType, addServiceTimeType, addSeuilVersion, addSeuilCode });         
    };  

    addService = async () => {
        let { addServiceVersion, addServiceMeasureType, addServiceTimeType, errorMessage } = this.state;

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
                /*
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New service added !");
                            }
                        }
                    )
                }
                */
            }
        ); 
    };

    getAllServices = async () => {
        const { contract } = this.props.state;
        let { listServices } = this.state;
        listServices = await contract.methods.getAllServices().call();

        this.setState({ listServices });  
    };    

    getAlertConfig = async () => {
        const { contract } = this.props.state;
        let { listAlertConfig } = this.state;

        listAlertConfig = await contract.methods.getAllAlertConfigs().call();

        this.setState({ listAlertConfig });  
    };       

    getAllMeasures = async (serviceId) => {
        const { contract } = this.props.state;
        let { listMeasures } = this.state;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();

        this.setState({ listMeasures });  
    };  

    addMeasure = async (serviceId) => {
        const { accounts, contract, web3 } = this.props.state;
        let {currentMeasureFake } = this.state;

        let context = this;
        let header, body;

        [header, body] = fakeMeasure(currentMeasureFake, this.state.listServices[serviceId]); 
        currentMeasureFake++;
        this.setState({ currentMeasureFake });

        await contract.methods.addMeasure(
            serviceId,
            header,  
            body
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                /*
                if(tx){
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New measure added !");
                                context.setServiceFocus(serviceId);
                            }
                        }
                    )
                }
                */
            }
        );  
    };    

    addAlert = async (alertConfigId, serviceId) => {
        const { accounts, contract, web3 } = this.props.state;

        let body = fakeAlert(alertConfigId, serviceId);
        let context = this;

        await contract.methods.addAlert(
            serviceId,
            alertConfigId,  
            body
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    /*
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New Alert added !");
                                context.setAlertConfigFocus(serviceId);
                            }
                        }
                    )
                    */
                }
            }
        );  
    }


    setServiceFocus = async (serviceId) => {
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();
        this.setState({ contract, selectedService, listMeasures });  
    };     


    setAlertConfigFocus = async (alertConfigId) => {
        let { contract } = this.props.state;
        let { selectedAlertConfig, listAlerts } = this.state;
        selectedAlertConfig = alertConfigId;
        listAlerts = await contract.methods.getAlerts(alertConfigId).call();
        this.setState({selectedAlertConfig,  listAlerts });  
    };     
   


    showAlert = (alert) =>{
       return alert;
    };

    showMeasure = (header, body) => {
        let objetHeader, objetBody;

        [objetHeader, objetBody] = measureToObject(header, body);

        return (<p> {objetHeader.date} - {objetHeader.measureType} ({objetHeader.version}) : {objetBody.val1} - {objetBody.val2} - {objetBody.val3} - {objetBody.val4} </p>);
    };

    addAlertConfig = async () => {
        let { addSeuilVersion, addSeuilCode, errorMessage } = this.state;

        if(addSeuilVersion === '' || 
            addSeuilCode === '' || 
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
            '0',
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

    render() {
        return (
            <main className="tester">

                <section className="">
                    <div className="tester-block" > 

                        <MyNotif 
                            contract={this.props.state.contractTarget}
                            errorMessage={this.state.errorMessage}    
                        />

                        <h1>Happy testing</h1>

                        <h2 className="tester">SERVICES</h2>

                        <form>                           
                            <div className="tester-line">
                                <label>
                                    Description du service
                                </label>
                                <input type="text" id="newServiceDescription" className="tester-input" 
                                    ref={(input) => { 
                                        this.newServiceDescription = input
                                    }}
                                />
                            </div>



                            <div className="tester-line">
                                <label>
                                    Measure du service
                                </label>
                                <MySelect 
                                    myName="addServiceMeasureType" 
                                    handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                                />
                            </div>

                            
                            <div className="tester-line">
                                <label>
                                    Version du service
                                </label>
                                <MySelect 
                                    myName="addServiceVersion" 
                                    handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                                />
                            </div>

                            <div className="tester-line">
                                <label>
                                    Fréquence
                                </label>

                                <input type="number" size="4" className="tester-input" id="newServiceNbTime" 
                                    ref={(input) => { 
                                        this.newServiceNbTime = input
                                    }}
                                />
                                <MySelect 
                                    myName="addServiceTimeType" 
                                    handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                                />
                            </div>
            
                        </form>

                        <div>
                            <input type="button" className="tester-button" value="NEW SERVICE" onClick= { () => this.addService() } />
                            <input type="button" className="tester-button" value="GET SERVICES" onClick= { () => this.getAllServices() }/>
                        </div>

                        {this.state.listServices.length > 0 
                            &&
                            this.state.listServices.map((service, index) => (
                                <p key={"serviceKey"+index}><input type="button" className="tester-button" value={service.description} onClick={ () => this.setServiceFocus(index) }/></p>       
                            ))
                        }

                    </div>

                    {this.state.selectedService !== -1
                    &&
                    <div className="" >
                        <br/>
                        <h2 className="tester">SERVICES - {this.state.listServices[this.state.selectedService].description}</h2>

                        <div><input type="button" className="tester-button" value="ADD MEASURE" onClick= { () => this.addMeasure(this.state.selectedService) }></input></div>

                        {this.state.listMeasures[0].length > 0 
                            &&
                            this.state.listMeasures[0].map((measure, index) => (
                                <div className="" key={"measureKey"+index}> {this.showMeasure(measure, this.state.listMeasures[1][index])}  </div>       
                            ))
                        }   
                    </div>
                    }

                    <h2 className="tester">SEUIL D'ALERTE</h2>                
                    <form>                           
                        <div className="tester-line">
                            <label>
                                Description du seuil
                            </label>
                            <input type="text" id="newSeuilDescription" className="tester-input" 
                                ref={(input) => { 
                                    this.newSeuilDescription = input
                                }}
                            />
                        </div>
                        
                        <div className="tester-line">
                            <label>
                                Version du seuil
                            </label>
                            <MySelect 
                                myName="addSeuilVersion" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="tester-line">
                            <label>
                                Code du seuil
                            </label>
                            <MySelect 
                                myName="addSeuilCode" 
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </div>

                        <div className="tester-line">
                            <label>
                                Valeur du seuil
                            </label>

                            <input type="number" size="4" className="tester-input" id="newSeuilLevel" 
                                ref={(input) => { 
                                    this.newSeuilLevel = input
                                }}
                            />
                        </div>
        
                    </form>
                    <div>
                        <input type="button" className="tester-button" value="NEW ALERT CONFIG" onClick= { () => this.addAlertConfig() } />
                        <input type="button" className="tester-button" value="GET ALERT CONFIG" onClick= { () => this.getAlertConfig() }/>
                    </div>

                    {this.state.listAlertConfig.length > 0 
                        &&
                        this.state.listAlertConfig.map((alerteConfig, index) => (
                            <p key={"alerteConfig_key"+index}><input type="button" className="tester-button" value={alerteConfig.description} onClick={ () => this.setAlertConfigFocus(index) }/></p>       
                        ))
                    }
                    
                    {this.state.selectedAlertConfig !== -1
                    &&
                    <div className="" >
                        <br/>
                        <h2 className="tester">ALERT CONFIG - {this.state.listAlertConfig[this.state.selectedAlertConfig].description}</h2>

                        <div><input type="button" className="tester-button" value="ADD ALERT" onClick= { () => this.addAlert(this.state.selectedAlertConfig, this.state.listAlertConfig[this.state.selectedAlertConfig].serviceId) }></input></div>

                        {this.state.listAlerts.length > 0 
                            &&
                            this.state.listAlerts.map((alert, index) => (
                                <div className="" key={"alertKey"+index}> {this.showAlert(alert)}  </div>       
                            ))
                        }   
                    </div>
                    }


                </section>


            </main>  
        )
    }
}