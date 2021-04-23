import React from 'react';

import {hexToString} from '../../utilsEco.js';
import "./MySelect.css";

export default class MySelectEth extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myValue: 'Select',
            myTabOptions: [],
            classSelector: "select",
            isOpen: false,
        };
    }

    componentDidMount = async() => {
        let myTabOptions = [];

        switch (this.props.myName){
            case "addService" : await this.recoltAllServicesOfContract(); break;
            case "addMeasureType" : await this.recoltAllMeasuresAvalable(); break;

            default : myTabOptions = []
        }

        this.setState({ myTabOptions });       
    }
  
    recoltAllMeasuresAvalable = async() => {
        let { ledgerContract, myTabOptions, accounts, myTypeUser } = this.props.state;

        console.log("Start Recolt All Measure", myTypeUser);        

        myTabOptions = [];
      
        if(ledgerContract != null){
            ledgerContract.getPastEvents('TypeMeasureUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index, element;
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New TypeMeasure"){
                        
                        index = myEvent.returnValues['_target'];
        
                        element = await ledgerContract.methods._typeMeasures(index).call({from:accounts[0]});

                        index = hexToString(index.substr(-16));

                        if(element.isActive){
                            if ((myTypeUser == 3) && (element.legislatorAddress==accounts[0])){
                                myTabOptions.push({code: index, aff: element.description});
                            }else if ((myTypeUser == 1) || (myTypeUser == 2)){
                                myTabOptions.push({code: index, aff: element.description});
                            }  
                        }
                    }       
                }
                this.setState({ myTabOptions });  
            });
        }
    }  
    
    recoltAllServicesOfContract = async() => {
        let { customerContract, myTabOptions, accounts, myTypeUser } = this.props.state;

        myTabOptions = [];
      
        if(customerContract != null){
            customerContract.getPastEvents('ServiceUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index, element;
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New service"){
                        index = myEvent.returnValues['_serviceId'];
                        element = await customerContract.methods._services(index).call({from:accounts[0]});

                        if(element.isActive){
                            if ((myTypeUser == 3) && (element.legislatorAddress==accounts[0])){
                                myTabOptions.push({code: index, aff: element.description});
                            }else if ((myTypeUser == 1) || (myTypeUser == 2)){
                                myTabOptions.push({code: index, aff: element.description});
                            }  
                        }
                    }       
                }
                this.setState({ myTabOptions });  
            });
        }
    }

    clickSelector() {
        let { classSelector, isOpen } = this.state;
        
        if(!isOpen){
            classSelector = "select is-open"     
        }else{
            classSelector = "select"
        }
        isOpen = !isOpen;

        this.setState({classSelector, isOpen});
    }
    
    selectValue(index) {
        let { myValue, classSelector, myTabOptions, isOpen } = this.state;

        myValue = myTabOptions[index].aff;
        classSelector = "select";
        isOpen = false;

        this.props.handleMySelect(this.props.myName, myTabOptions[index].code);

        this.setState({myValue, classSelector, myTabOptions, isOpen});
    }

    render() {
        let { myValue, classSelector } = this.state;

        return (
            <div className={classSelector}>
                <span className="placeholder" onClick={()=>{this.clickSelector();}}>{myValue}</span>
                <ul>
                    {
                        this.state.myTabOptions.map((myOption, index) => (
                            <li key={"select_"+index} onClick={()=>{this.selectValue(index);}}>{myOption.aff}</li>       
                        ))
                    }
                </ul>
            </div>
        )
    }
}