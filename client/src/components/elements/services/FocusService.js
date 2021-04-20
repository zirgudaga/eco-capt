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

    
    setServiceFocus = async (serviceId) => {
        let { contract } = this.props.state;
        let { selectedService, listMeasures } = this.state;
        selectedService = serviceId;    
        
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
    
    showMeasure = () => {
        if ((this.state.listMeasures[0] !== undefined) && (this.state.listMeasures[0].length>0)){
            return (
                this.state.listMeasures[0].map((measure, index) => (
                    <div className="" key={"measureKey"+index}>{measure}</div>       
                ))
            );
        }
    }

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
                <b>{this.props.myService.description}</b>

                <GraphService myService={this.props.myService} myMeasures={this.state.listMeasures}/>
                <ServiceInfo myService={this.props.myService}/>

                <button type="button" className="focus-service-cta" 
                    onClick= { () => this.addMeasure() }>New report
                </button> 

            </div>
        );      
    }
}