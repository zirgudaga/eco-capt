import React from 'react';
import "./HomeClient.css";

export default class HomeClient extends React.Component {

    render() {
        return (
            <div className="home">
                <div className="home-main">
                    <h1 className="home-title">My customers</h1>
                    <p className="home-p">Welcome</p>
                    <br />
                    <p>You will find a list of all our customers on the right hand side.</p>
                    <br />
                    <p>To display details of a specific customer, please click on it.</p>
                    <br />
                    <p>You can also add a new customer by clicking on the “New Customer” button.</p>
                    <br />
                    <p>Being honest has never been easier!</p>
                    <div className="home-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}