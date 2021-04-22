import React from 'react';

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
            case "addService" : await this.recoltAllServiceOfContract(); break;
            default : myTabOptions = []
        }

        this.setState({ myTabOptions });       
    }

    
    //TODO ADAPTER CETTE LISTE DEROULANTE A CHAQUE PROFIL
    recoltAllServiceOfContract = async() => {
        let { contract, myTabOptions, accounts } = this.props.state;

        myTabOptions = [];
       
        if(contract != null){
            contract.getPastEvents('ServiceUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index, serverTemp;
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New service"){
                        index = myEvent.returnValues['_serviceId'];
                        serverTemp = await contract.methods._services(index).call({from:accounts[0]});
                        myTabOptions.push({code: index, aff: serverTemp.description});
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