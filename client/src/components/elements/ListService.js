import React from 'react';

import "./ListService.css";

export default class ListService extends React.Component {

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