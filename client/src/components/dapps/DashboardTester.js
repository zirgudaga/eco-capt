import React from 'react';
import {stringToHex, fakeMeasure, measureToObject} from '../../utilsEco.js';
import MyNotif from '../elements/MyNotif.js';
import MySelect from '../elements/MySelect.js';

import "./DashboardTester.css";

export default class DashboardTester extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            listMeasures: [], 
            currentMeasureFake : 0,
            addServiceVersion: '',
            addServiceMeasureType: '',
            addServiceTimeType: '',
            errorMessage: '',
        };
    }

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

            console.log("Merci de remplir correctement le formulaire !");
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

    getAllServices = async () => {
        const { contract } = this.props.state;
        let { listServices } = this.state;
        listServices = await contract.methods.getAllServices().call();

        this.setState({ listServices });  
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
            }
        );  
    };    

    setServiceFocus = async (serviceId) => {
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();
        this.setState({ contract, selectedService, listMeasures });  
    };     

    showMeasure = (header, body) => {
        let objetHeader, objetBody;

        [objetHeader, objetBody] = measureToObject(header, body);

        return (<p> {objetHeader.date} - {objetHeader.measureType} ({objetHeader.version}) : {objetBody.val1} - {objetBody.val2} - {objetBody.val3} - {objetBody.val4} </p>);
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
                </section>
            </main>  
        )
    }
}