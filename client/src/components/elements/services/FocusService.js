import React from 'react';

import {fakeMeasure} from '../../../utilsEco.js';

import GraphService from './GraphService.js';
import ServiceInfo from './InfoService.js';

import "./FocusService.css";

export default class FocusService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listMeasures: [],
            currentMeasureFake: 0,
            onOff: false,
            elementOnOff: null,
        };        
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
       this.setServiceFocus(this.props.myService.serviceId); 
    }

    affActive = () => {
        if(this.props.myService.isActive){
            return (<svg key="toggleOn" className="svg-inline--fa fa-toggle-on fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="toggle-on" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M384 64H192C86 64 0 150 0 256s86 192 192 192h192c106 0 192-86 192-192S490 64 384 64zm0 320c-70.8 0-128-57.3-128-128 0-70.8 57.3-128 128-128 70.8 0 128 57.3 128 128 0 70.8-57.3 128-128 128z"></path></svg>); 
        }else{       
            return (<svg key="toggleOff" className="svg-inline--fa fa-toggle-off fa-w-18" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="toggle-off" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" data-fa-i2svg=""><path fill="currentColor" d="M384 64H192C85.961 64 0 149.961 0 256s85.961 192 192 192h192c106.039 0 192-85.961 192-192S490.039 64 384 64zM64 256c0-70.741 57.249-128 128-128 70.741 0 128 57.249 128 128 0 70.741-57.249 128-128 128-70.741 0-128-57.249-128-128zm320 128h-48.905c65.217-72.858 65.236-183.12 0-256H384c70.741 0 128 57.249 128 128 0 70.74-57.249 128-128 128z"></path></svg>);
        }
    }
    
    toggleService = async () => {
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.toggleService(
            this.props.myService.serviceId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});              
    }

    setServiceFocus = async (serviceId) => {
        let { contract } = this.props.state;
        let { listMeasures } = this.state;
        
        listMeasures=[];

        contract.getPastEvents("MeasureReceive", { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
        .then(async (myEvents) => {
            let index=0;
            for(let myEvent of myEvents){
                if(myEvent.returnValues['_serviceId'] == serviceId){
                    listMeasures[index] = {};
                    listMeasures[index].header = myEvent.returnValues['_header'];
                    listMeasures[index].body = myEvent.returnValues['_body'];
                    index++;
                }           
            }
            this.setState({ listMeasures });  
        }); 
    };   

    addMeasure = async () => {
        const { accounts, contract, web3 } = this.props.state;
        let {currentMeasureFake } = this.state;

        let serviceId=this.props.myService.serviceId;

        let header, body;

        [header, body] = fakeMeasure(currentMeasureFake, this.props.myService); 
        currentMeasureFake++;
        this.setState({ currentMeasureFake });

        await contract.methods.addMeasure(
            serviceId,
            header,  
            body
        ).send({ from: accounts[0] },
            async (erreur, tx) => {
                if(tx){
                    /*
                    await web3.eth.getTransactionReceipt(tx, 
                        async (erreur, receipt) => {
                            if(receipt!=null && receipt.status){
                                console.log("New measure added !");
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
            <div className="focus-service-body">
                
                
                <b>{this.props.myService.description}</b><span onClick= { () => this.toggleService() }>{this.affActive()}</span>

                <GraphService myService={this.props.myService} myMeasures={this.state.listMeasures}/>
                <ServiceInfo myService={this.props.myService}/>

                <button type="button" className="focus-service-cta" 
                    onClick= { () => this.addMeasure() }>New report
                </button> 

            </div>
        );      
    }
}