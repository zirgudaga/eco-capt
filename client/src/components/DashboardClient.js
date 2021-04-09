import React from 'react';
import {stringToHex} from '../utilsEco.js';
import MySelect from './MySelect.js';

export default class DashboardClient extends React.Component {

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
                {code:'SOUF0002', aff:'Souffre version 2'}                
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
        let { addServiceVersion, addServiceMeasureType, addServiceTimeType } = this.state;

        if(addServiceVersion === '' || 
        addServiceMeasureType === '' || 
        addServiceTimeType === '' || 
        this.newServiceDescription.value.trim() === '' ||
        this.newServiceNbTime.value <= '0'
        ){
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
            <section className="w-full p-4">
           

            </section>
        )
    }
}