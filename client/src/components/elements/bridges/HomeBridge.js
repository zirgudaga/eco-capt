import React from 'react';
import "./HomeBridge.css";

export default class HomeBridge extends React.Component {

    render() {
        return (
            <div className="home">
                <div className="home-main">
                    <h1 className="home-title">My bridges</h1>
                    <p className="home-p">Welcome</p>
                    <br />
                    <p>You will find a list of all your bridges on the right hand side.</p>
                    <br />
                    <p>To display details of a specific bridge, please click on it.</p>
                    <br />
                    <p>You can also add a new bridge by clicking on the “New Bridge” button.</p>
                    <br />
                    <p>Being honest has never been easier !</p>
                    <div className="home-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}