import React from 'react';

import "./NotifBar.css";

export default class NotifBar extends React.Component {

    constructor(props) {
        super(props);
    }

    myNotice = () => {
        if(this.props.errorMessage !== ''){
            return (<input type="button" className="tester-button-alerte" value={this.props.errorMessage}/>);
        }

        if(this.props.contract !== null){
            return (<input type="button" className="tester-button-notice" value={"Status OK - " + this.props.contract}/>);
        }
        else{
            return (<input type="button" className="tester-button-waiting" value="Status Waiting WEB3 connection"/>);
        }
    }

    render() {
        return (
            <p>
                {this.myNotice()}
            </p>
        );      
    }
}