import React from 'react';

import MySelectEth from '../MySelectEth.js';
import { hexToString } from '../../../utilsEco.js';

import "./InfoService.css";

export default class InfoService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            bridgeAddressEdit : false,
            legislatorAddressEdit : false,
            techMasterAddressEdit : false,
            addBridgeAddress : '',
            addLegislatorAddress : '',
            addTechMasterAddress : '',
        };        
    }

    componentDidMount = () => {
        let { myService } = this.props;
        let { addBridgeAddress, addLegislatorAddress, addTechMasterAddress } = this.state;
        let address0 = "0x0000000000000000000000000000000000000000";

        if(myService.bridgeAddress!==address0) addBridgeAddress = myService.bridgeAddress;
        if(myService.legislatorAddress!==address0) addLegislatorAddress = myService.legislatorAddress;
        if(myService.techMasterAddress!==address0) addTechMasterAddress = myService.techMasterAddress;

        this.setState({ addBridgeAddress, addLegislatorAddress, addTechMasterAddress });  
    }

    handleMySelect = async (selectedName, selectedValue) => {
        let { addBridgeAddress, addLegislatorAddress, addTechMasterAddress } = this.state;

        switch(selectedName){
            case 'addBridgeAddress': addBridgeAddress = selectedValue; break;
            case 'addLegislatorAddress': addLegislatorAddress = selectedValue; break;
            case 'addTechMasterAddress': addTechMasterAddress = selectedValue; break;            
            default: console.log('ERR - Select not found'); 
        }      

        this.setState({ addBridgeAddress, addLegislatorAddress, addTechMasterAddress });         
    };  
 

    toggleEditAddress = (index) => {
        let { bridgeAddressEdit, legislatorAddressEdit, techMasterAddressEdit } = this.state;
        
        switch(index){
            case 0 : bridgeAddressEdit = !bridgeAddressEdit; break;
            case 1 : legislatorAddressEdit = !legislatorAddressEdit; break;
            case 2 : techMasterAddressEdit = !techMasterAddressEdit; break;            
        }

        this.setState( { bridgeAddressEdit, legislatorAddressEdit, techMasterAddressEdit } );
    }

    validEditAddress = async (index) => {
        let { myService } = this.props;
        let { addBridgeAddress, addLegislatorAddress, addTechMasterAddress } = this.state;
        const { accounts, customerContract } = this.props.state;

        let newValue = '';

        switch(index){
            case 0 : 
                newValue = addBridgeAddress; 
                await customerContract.methods.setBridgeAddress(
                    myService.serviceId, 
                    newValue        
                ).send({ from: accounts[0] },
                    async (erreur, tx) => {

                    }
                );         
                break;
            case 1 : 
                newValue = addLegislatorAddress; 
                await customerContract.methods.setLegislatorAddress(
                    myService.serviceId, 
                    newValue        
                ).send({ from: accounts[0] },
                    async (erreur, tx) => {

                    }
                );         
                break;
            case 2 : 
                newValue = addTechMasterAddress; 
                await customerContract.methods.setTechMasterAddress(
                    myService.serviceId, 
                    newValue        
                ).send({ from: accounts[0] },
                    async (erreur, tx) => {
                    }
                );     
                break;    
        }  
        this.toggleEditAddress(index);  
    }

    showEditAddress = (index) => {
        let { myService } = this.props;
        let { bridgeAddressEdit, legislatorAddressEdit, techMasterAddressEdit } = this.state;
        let address0 = "0x0000000000000000000000000000000000000000";
        let addressValue = "0x0000000000000000000000000000000000000000";
        let isAff = false;
        let isAccess = false;
        let nameSelect = '';

        if (this.props.state.myTypeUser==1){
            isAccess = true;
        }

        if ((this.props.state.myTypeUser==2)&&(index==1)){          
            isAccess = true;
        }

        if ((this.props.state.myTypeUser==4)&&(index==0)&&(this.props.state.accounts[0]==myService.techMasterAddress)){
            isAccess = true;
        }

        switch(index){
            case 0 : 
                isAff = bridgeAddressEdit?false:true; 
                nameSelect="addBridgeAddress"; 
                addressValue=myService.bridgeAddress;
                break;
            case 1 : 
                isAff = legislatorAddressEdit?false:true; 
                nameSelect="addLegislatorAddress"; 
                addressValue=myService.legislatorAddress;
                break;
            case 2 : 
                isAff = techMasterAddressEdit?false:true; 
                nameSelect="addTechMasterAddress"; 
                addressValue=myService.techMasterAddress;
                break;            
        }  

        if(!isAccess)
            return (
                <span className="service-info-details">
                    {addressValue===address0?"En attente":addressValue}
                </span>
            );

        if(isAff){
            return(
                <span className="service-info-details">
                    {addressValue===address0?"En attente":addressValue}
                    <i className="fas fa-pen" onClick={() => {this.toggleEditAddress(index)}}></i>
                </span>
            );
        }else{
            return(
                <span className="service-info-details">
                    <MySelectEth 
                        state={this.props.state}
                        myName={nameSelect} 
                        handleMySelect={(selectedName, selectedValue) => this.handleMySelect(selectedName, selectedValue)}              
                    />           
                    <i className="fas fa-check" onClick={() => {this.validEditAddress(index)}}></i>
                    <i className="fas fa-times"onClick={() => {this.toggleEditAddress(index)}}></i>
                </span>
            );
        }
    }

    render() {
        let { myService } = this.props;

        return (
            <div className="service-info">
                <p>Nom du service : <span className="service-info-details">{myService.description}</span></p>
                <p>Nombre de rapports : <span className="service-info-details">{myService.measureIdCounter._value}</span></p>
                <p>Type de mesure : <span className="service-info-details">{hexToString(myService.measureType)}</span></p>
                <p>Fréquence des mesures : <span className="service-info-details">Toutes les {myService.nbTime} {hexToString(myService.timeCode)}</span></p>
                <div>Adresse du bridge : {this.showEditAddress(0)}</div>
                <div>Adresse du législateur : {this.showEditAddress(1)}</div>
                <div>Adresse du technicien : {this.showEditAddress(2)}</div>                        
            </div>
        );      
    }
}