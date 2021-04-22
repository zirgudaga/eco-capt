import React from 'react';
import './MainHome.css';

export default class MainHome extends React.Component {

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
            <div className="main-content">
                <main className="main-client">
                    <div className="page-header">
                        <div className="page-header-body">
                            <h1 className="page-header-title">Bienvenue sur votre espace</h1>
                            <p className="page-header-address">Vous êtes connecté via l'adresse : <span className="address-color">{this.showAddress()}</span></p>
                            {this.props.state.customerContractAddress
                            ?(<p className="page-header-contract">Votre contract client est : <span className="address-color">{this.props.state.customerContractAddress}</span></p>)
                            :(<p className="page-header-contract">Pas de contract client selectionné...</p>)}
                            
                            {this.props.state.customerContractAddress &&
                            <div>
                                <p>Pour accéder à vos services, cliquez sur le bouton ci-dessous :</p>
                                <a className="page-header-cta" type="button" onClick = { () => {this.props.goTo("Service");} }>
                                    Services
                                </a>
                            </div>}
                            <p className="page-header-help">Une question ? Contactez-nous !</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }
}