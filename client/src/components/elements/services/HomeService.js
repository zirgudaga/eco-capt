import React from 'react';
import "./HomeService.css";

export default class HomeService extends React.Component {

    render() {
        return (
            <div className="home-service">
                <div className="home-service-main">
                    <h1 className="home-service-title">My services</h1>
                    <p className="home-service-p">Welcome to your service interface</p>
                    <br />
                    <p>You will find a list of your active services on the right hand side.</p>
                    <br />
                    <p>To display details of a specific service, please click on it</p>
                    <br />
                    <p>You can also add a new service by clicking on the “New Service” button.</p>
                    <br />
                    <p>You will then be asked : a description of your service, the type of measure you want to set up and the frequency. Once done, you will be assigned a TechMaster who will link your Eco-Capt Bridge to your service,
                    Thanks to him, your measures will be processed, certified and displayed in your app.
                    </p>
                    <br />
                    <p>Being honest has never been easier!</p>
                    <div className="home-service-logo">
                        <a href="."><img width="208" src="ecocapt-logo.png" alt="ecocap-logo"/></a>
                    </div>
                </div>
            </div>
        );      
    }
}