import React from 'react';

import {getTabtSelect} from '../../utilsEco.js';

import "./MySelect2.css";

export default class MySelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myValue: '',
            myTabOptions: []
        };
    
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount = () => {
        let myTabOptions = [];
        myTabOptions = getTabtSelect(this.props.myName);
        this.setState({ myTabOptions });       
    }


    handleChange(event) {
        this.setState({myValue: event.target.value});
        this.props.handleMySelect(this.props.myName, event.target.value);
    }
    
    render() {
        return (
            <select value={this.state.myValue}>
                <option id="select-option" value="">Select</option>
                {this.state.myTabOptions.map((myOption, index) => (
                    <option key={"select_"+myOption.index}>{myOption.aff}</option>       
                ))}
            </select>
        )
    }
}