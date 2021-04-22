import React from 'react';

import MainHome from './MainHome.js';
import MainService from './MainService.js';
import MainAlert from './MainAlert.js';

import MainClient from './MainClient.js';
import MainLegislator from './MainLegislator.js';

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
            case "Customers" : return (<MainClient state={this.props.state} goContract = {(addr) => {this.props.goContract(addr);}}/>);
            case "Legislators" : return (<MainLegislator state={this.props.state} goContract = {(addr) => {this.props.goContract(addr);}}/>);
            //case "Technicians" : return (<MainTechnician state={this.props.state} goContract = {(addr) => {this.props.goContract(addr);}}/>);
            //case "Bridges" : return (<MainBridge state={this.props.state} goContract = {(addr) => {this.props.goContract(addr);}}/>);
            case "Services" : return (<MainService state={this.props.state}/>);
            case "Alerts" : return (<MainAlert state={this.props.state}/>);
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