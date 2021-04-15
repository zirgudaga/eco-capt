import React from 'react';
import './DashboardClientMain.css';

export default class DashboardClientMainHome extends React.Component {


    showAddress = () => {      
        if(this.props.state.accounts !== null){

            return this.props.state.accounts[0];
        } 
        else{
            return 'Waiting';
        }       
    }

    render() {
        return (
            <div className="main-flex">
                <div className="main-content">
                    <header>
                        <div className="menu-toggle">
                            <label className="sidebar-toggle">
                                <span className="las la-bars"></span>
                            </label>
                        </div>

                        <div className="home-logo">
                            <a href="."><img width="168" height="88" src="ecocapt-logo.png" href="." alt="ecocap-logo"/></a>
                        </div>

                        <div className="header-icons">
                            <span className="las la-search"></span>
                            <span className="las la-bookmark"></span>
                            <span className="las la-sms"></span>
                        </div>
                    </header>

                    <main className="main-client">
                        <div className="page-header">
                            <div className="page-header-body">
                                <h1 className="page-header-title">Bienvenue sur votre espace</h1>
                                <p className="page-header-address">Vous êtes connecté via l'adresse : <span className="address-color">{this.showAddress()}</span></p>
                                <p className="page-header-contract">Votre contract client est le numéro : <span className="address-color">{this.props.state.contractTarget}</span></p>
                                <p>Pour accéder à vos services, cliquez sur le bouton ci-dessous :</p>
                                <a className="page-header-cta" type="button" onClick = { () => {this.props.goTo("Service");} }>
                                    Services
                                </a>
                                <p className="page-header-help">Une question ? Contactez-nous !</p>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        );
    }
}
