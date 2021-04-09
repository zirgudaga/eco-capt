import React from 'react';

import DashboardClientSidebar from './DashboardClientSidebar.js'
import DashboardClientMainHome from './DashboardClientMainHome.js'
import DashboardClientMainService from './DashboardClientMainService.js'

export default class DashboardClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            currentModuleSelect: 'Service',
        };
    }

    selectedDashboardLaucher = () => {

        switch(this.state.currentModuleSelect){
            case "Home" : return (<DashboardClientMainHome state={this.props.state}/>);
            case "Service" : return (<DashboardClientMainService state={this.props.state}/>);
            default: return (<DashboardClientMainHome state={this.props.state}/>);
        }
    }

    render() {
        return (
            <div className="App">
    
                <DashboardClientSidebar state={this.props.state} goTo={(currentModuleSelect) => {this.setState({ currentModuleSelect });}}/>
                {this.selectedDashboardLaucher()}
                <label className="body-label sidebar-toggle"></label>
            </div>
        )
    }
}