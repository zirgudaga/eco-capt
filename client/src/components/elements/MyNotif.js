import React from 'react';

import "./MyNotif.css";

export default class MyNotif extends React.Component {

    myNoticeLauncher = () => {
        if(this.props.errorMessage !== ''){
            return (<input type="button" className="tester-button-alerte" value={this.props.errorMessage}/>);
        }

        if(this.props.contractAddress !== null){
            return (<input type="button" className="tester-button-notice" value={"Status OK - " + this.props.contractAddress}/>);
        }
        else{
            return (<input type="button" className="tester-button-waiting" value="Status Waiting Contract Connexion"/>);
        }
    }

    render() {
        return (
            <p>
                {this.myNoticeLauncher()}
            </p>
        );      
    }
}