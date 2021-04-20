import React from 'react';

import MainHome from './MainHome.js';
import MainService from './MainService.js';
import MainAlert from './MainAlert.js';
import MainNavBar from '../layouts/MainNavBar.js';

import './DashboardClient.css';


export default class DashboardClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentModuleSelect: 'Home',
        };
    }

    selectedDashboardLaucher = () => {

        switch(this.state.currentModuleSelect){
            case "Home" : return (<MainHome state={this.props.state} goTo={(currentModuleSelect) => {this.setState({ currentModuleSelect });}}/>);
            case "Service" : return (<MainService state={this.props.state}/>);
            case "Alert" : return (<MainAlert state={this.props.state}/>);
            default: return (<MainHome state={this.props.state}/>);
        }
    }

    render() {
        return (
            <div className="dashboard-main">
                <MainNavBar state={this.props.state} goTo={(currentModuleSelect) => {this.setState({ currentModuleSelect });}}/>
                {this.selectedDashboardLaucher()}
            </div>
        )
    }
}