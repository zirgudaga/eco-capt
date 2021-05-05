import React from 'react';
import "./HomeMeasure.css";

export default class HomeMeasure extends React.Component {

    render() {
        return (
            <div className="home">
                <div className="home-main">
                    <h1 className="home-title">My measures</h1>
                    <p className="home-p">Welcome</p>
                    <br />
                    <p>You will find a list of all our measures on the right hand side.</p>
                    <br />
                    <p>To display details of a specific measure, please click on it.</p>
                    <br />
                    <p>You can also add a new measure by clicking on the “New Measure” button.</p>
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