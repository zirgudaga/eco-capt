import React from 'react';

import {getTabtSelect} from '../../utilsEco.js';

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
            <div>
                <select value={this.state.myValue} onChange={this.handleChange}>
                    <option id="select-option" value="">Select</option>
                    {this.state.myTabOptions.map((myOption) => (
                        <option key={myOption.code} value={myOption.code}>{myOption.aff}</option>       
                    ))}
                </select>
            </div>
        )
    }
}