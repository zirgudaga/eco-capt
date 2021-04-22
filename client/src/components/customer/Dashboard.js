import React from 'react';

import MainHome from './MainHome.js';
import MainService from './MainService.js';
import MainAlert from './MainAlert.js';
import MainClient from './MainClient.js';

import MainNavBar from '../layouts/MainNavBar.js';


import './Dashboard.css';


export default class Dashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentModuleSelect: 'Home',
        };
    }

    selectedDashboardLaucher = () => {

        switch(this.state.currentModuleSelect){
            case "Home" : return (<MainHome state={this.props.state} goTo={(currentModuleSelect) => {this.setState({ currentModuleSelect });}}/>);
            case "Client" : return (<MainClient state={this.props.state} goContract = {(addr) => {this.props.goContract(addr);}}/>);
            case "Service" : return (<MainService state={this.props.state}/>);
            case "Alert" : return (<MainAlert state={this.props.state}/>);
            default: return (<MainHome state={this.props.state}/>);
        }
    }

    render() {
        return (
            <div className="dashboard-main">
                <MainNavBar 
                    state={this.props.state} 
                    contractClose= {()=>this.props.contractClose()}
                    goTo={(currentModuleSelect) => {this.setState({ currentModuleSelect });}}/>
                {this.selectedDashboardLaucher()}
            </div>
        )
    }
}