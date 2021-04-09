import React from 'react';

import DashboardTester from "./DashboardTester.js";

import '../App.css'

export default class Dapps extends React.Component {

    render() {
        return (
            <main className="test">
                <DashboardTester state={this.props.state}/>
            </main>
        )
    }
}