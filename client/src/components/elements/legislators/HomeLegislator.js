import React from 'react';
import "./HomeLegislator.css";

export default class HomeLegislator extends React.Component {

    render() {
        return (
            <div className="home">
                <div className="home-main">
                    <h1 className="home-title">My legislators</h1>
                    <p className="home-p">Welcome</p>
                    <br />
                    <p>You will find a list of all our customers on the right hand side.</p>
                    <br />
                    <p>To display details of a specific customer, please click on it.</p>
                    <br />
                    <p>You can also add a new legislator by clicking on the “New Legislator” button.</p>
                    <br />
                    <p>Being honest has never been easier!</p>
                    <div className="home-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}