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
            return (<i className="fas fa-toggle-on" key="fa-toggle-on"></i>); 
        }else{       
            return (<i className="fas fa-toggle-off" key="fa-toggle-off"></i>);
        }
    }
    
    toggleService = async () => {
        const { accounts, contract, web3 } = this.props.state;
        await contract.methods.toggleService(
            this.props.myService.serviceId
        ).send({ from: accounts[0] }, async (erreur, tx) => {});              
    }

    setServiceFocus = async (serviceId) => {
        let { customerContract } = this.props.state;
        let { listMeasures } = this.state;
        
        listMeasures=[];

        customerContract.getPastEvents("MeasureReceive", { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
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
        const { accounts, customerContract } = this.props.state;
        let {currentMeasureFake } = this.state;

        let serviceId=this.props.myService.serviceId;

        let header, body;

        [header, body] = fakeMeasure(currentMeasureFake, this.props.myService); 
        currentMeasureFake++;
        this.setState({ currentMeasureFake });

        await customerContract.methods.addMeasure(
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

                {(this.props.state.myTypeUser == 1) &&
                <button type="button" className="focus-service-cta" 
                    onClick= { () => this.addMeasure() }>New report
                </button> 
                }

            </div>
        );      
    }
}