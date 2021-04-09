import React from 'react';
import "./TemplateElement.css";

export default class TemplateElement extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            myState: 'toto',
        };
    }

    myFunction = () => {

    }

    render() {
        return (
            <div className="">
                {this.myFunction()}
            </div>
        );      
    }
}