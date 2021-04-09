import React from 'react';

import Sidebar from './Sidebar.js'
import EcoMain from './EcoMain.js'

import '../App.css'

export default class DappsClient extends React.Component {

    render() {
        return (
            <div className="App">
                <Sidebar state={this.props.state}/>
                <EcoMain state={this.props.state}/>
                <label for="sidebar-toggle" class="body-label"></label>
            </div>

        )
    }
}