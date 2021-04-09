import React from 'react';
import {stringToHex} from '../utilsEco.js';
import MySelect from './MySelect.js';
import NotifBar from './NotifBar.js';

import "./DashboardTester.css";

export default class DashboardTester extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            listMeasures: [], 

            addServiceTabVersions: [
                {code:'00.01.00', aff:'Version 0.1'},
                {code:'00.02.00', aff:'Version 0.2'}
            ], 
            addServiceVersion: '',

            addServiceTabMeasureType: [
                {code:'SON_0001', aff:'Accoustique version 1'},
                {code:'SOUF0001', aff:'Emission de soufre version 1'},   
                {code:'SOUF0002', aff:'Emission de soufre version 2'}                              
            ], 
            addServiceMeasureType: '',

            addServiceTabTimeType: [
                {code:'Y', aff:'Année'},
                {code:'m', aff:'Mois'},
                {code:'d', aff:'Journée'},
                {code:'H', aff:'Heure'},                                
                {code:'i', aff:'Minutes'},                
            ], 
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
            stringToHex(addServiceVersion), 
            this.newServiceDescription.value.trim(),
            stringToHex(addServiceMeasureType), 
            stringToHex(addServiceTimeType),            
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
        console.log("Get Services");
        const { contract } = this.props.state;
        let { listServices } = this.state;
        listServices = await contract.methods.getAllServices().call();

        console.log(listServices);

        this.setState({ listServices });  
    };    

    getAllMeasures = async (serviceId) => {
        console.log("Get Services");
        const { contract } = this.props.state;
        let { listMeasures } = this.state;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();

        console.log(listMeasures);

        this.setState({ listMeasures });  
    };  

    addMeasure = async (serviceId) => {
        const { accounts, contract, web3 } = this.props.state;

        let context = this;

        await contract.methods.addMeasure(
            serviceId,
            "0x0102030405060708090A0B0C0D0E0F1112131415161718191A1B1C1D1E1F",  
            "0x0102030405060708090A0B0C0D0E0F1112131415161718191A1B1C1D1E1F"
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
        console.log("Focus Measure "+serviceId);
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;
        listMeasures = await contract.methods.getAllMeasures(serviceId).call();
        this.setState({ contract, selectedService, listMeasures });  
    };     

    render() {
        return (
            <section className="">
                <div className="tester-block" > 

                    <NotifBar 
                        contract={this.props.state.contractTarget}
                        errorMessage={this.state.errorMessage}    
                    />

                    <h1>Happy testing</h1>

                    <h2 className="tester">SERVICES</h2>

                    <form>
                        <p>
                            <label>
                                Description du service
                            </label>
                            <input type="text" id="newServiceDescription" 
                                ref={(input) => { 
                                    this.newServiceDescription = input
                                }}
                            />
                        </p>

                        <p>
                            <label>
                                Version du service
                            </label>
                            <MySelect 
                                myName="addServiceVersion" 
                                myTabOptions={this.state.addServiceTabVersions}
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </p>


                        <p>
                            <label>
                                Measure du service
                            </label>
                            <MySelect 
                                myName="addServiceMeasureType" 
                                myTabOptions={this.state.addServiceTabMeasureType}
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </p>

                        <p>
                            <label>
                                Fréquence
                            </label>

                            <input type="number" size="4" className="tester-input-number" id="newServiceNbTime" 
                                ref={(input) => { 
                                    this.newServiceNbTime = input
                                }}
                            />
                            <MySelect 
                                myName="addServiceTimeType" 
                                myTabOptions={this.state.addServiceTabTimeType}
                                handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                            />
                        </p>
          
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

                        <p><input type="button" className="tester-button" value="ADD MEASURE" onClick= { () => this.addMeasure(this.state.selectedService) }></input></p>

                        {this.state.listMeasures[0].length > 0 
                            &&
                            this.state.listMeasures[0].map((measure, index) => (
                                <div className="" key={"measureKey"+index}><p> {measure} </p> </div>       
                            ))
                        }   
                    </div>
                }
            </section>
        )
    }
}