import React from 'react';

import {getTabSelect} from '../../utilsEco.js';

import "./MySelect.css";

export default class MySelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myValue: 'Select',
            myTabOptions: [],
            classSelector: "select",
            isOpen: false,
        };
    }

    componentDidMount = () => {
        let myTabOptions = [];
        myTabOptions = getTabSelect(this.props.myName);
        this.setState({ myTabOptions });       
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