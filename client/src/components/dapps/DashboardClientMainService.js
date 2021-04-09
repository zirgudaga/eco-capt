import React from 'react';
import './DashboardClientMain.css';

export default class DashboardClientMainService extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listServices: [],
            selectedService: -1,
            errorMessage: '',
        };
    }


    render() {
        return (
            <div className="">
                <div className="main-content">
                    <header>
                        <div className="menu-toggle">
                            <label className="sidebar-toggle">
                                <span className="las la-bars"></span>
                            </label>
                        </div>

                        <div className="header-icons">
                            <span className="las la-search"></span>
                            <span className="las la-bookmark"></span>
                            <span className="las la-sms"></span>
                        </div>
                    </header>

                    <main>
                        <div className="page-header">
                            <div>
                                <h1>EcoCapt Dashboard Service</h1>
                                <small>Monitor key mectrics. Check your data blabla</small>
                            </div>
                        </div>      
                    </main>
                </div>
            </div>
        );
    }
}
