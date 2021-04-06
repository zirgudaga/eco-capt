import React from 'react';

export default class MySelect extends React.Component {

    constructor(props) {
        super(props);
        this.state = {myValue: ''};
    
        this.handleChange = this.handleChange.bind(this);
    }

    handleChange(event) {
        this.setState({myValue: event.target.value});
        this.props.handleMySelect(this.props.myName, event.target.value);
    }
    
    render() {
        return (
            <select value={this.state.myValue} onChange={this.handleChange}>
                <option value="">-Choississez une option-</option>
                {this.props.myTabOptions.map((myOption) => (
                    <option key={myOption.code} value={myOption.code}>{myOption.aff}</option>       
                ))}
            </select>
        )
    }
}