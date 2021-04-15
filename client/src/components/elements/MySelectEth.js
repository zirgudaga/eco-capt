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
            case "addService" : myTabOptions = await this.recoltAllServiceOfContract(); break;
            default : myTabOptions = []
        }

        console.log("MyTab", myTabOptions)

        this.setState({ myTabOptions });       
    }

    
    //TODO ADAPTER CETTE LISTE DEROULANTE A CHAQUE PROFIL
    recoltAllServiceOfContract = async() => {
        const { contract } = this.props.state;

        let returnTab = [];
        
        if(contract != null){
            let listServices;
            listServices = await contract.methods.getAllServices().call();
            for(let index in listServices){
                returnTab.push({code: index, aff: listServices[index].description});
            }
        }     
     
        return returnTab;
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