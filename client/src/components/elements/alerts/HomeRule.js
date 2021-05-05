import React from 'react';
import "./HomeRule.css";

export default class HomeRule extends React.Component {

    render() {
        return (
            <div className="home-rule">
                <div className="home-rule-main">
                    <h1 className="home-rule-title">My alerts</h1>
                    <p className="home-rule-p">Welcome to your alert interface</p>
                    <br />
                    <p>You will find a list of your active rules on the right hand side.</p>
                    <br />
                    <p>To display details of a specific rule, please click on it.</p>
                    <br />
                    <p>Vous pouvez ajouter un règle d'alerte en cliquant sur "NEW RULE"</p>
                    <br />
                    <p>You will then be asked : a description of your rule, the type of alert you want to set up and the threshold. Once done, your eco-capt Bridge will send a warning as soon as the threshold is exceeded.
                    Thanks to it, you will have access to all your emissions at your fingertips.
                    </p>
                    <br />
                    <p>Being honest has never been easier!</p>
                    <div className="home-rule-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}