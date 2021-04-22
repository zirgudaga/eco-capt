import React from 'react';

import "./ListLegislator.css";

export default class ListLegislator extends React.Component {

    render() {
        return (
            <div className="list-legislator-body">
                <div className="list-legislator-ul">
                    {this.props.state.listClients.length > 0 
                        ?
                        this.props.state.listClients.map((client, index) => (
                            <div className="list-legislator" key={"legislatorKey"+index} onClick={ () => this.props.setClientFocus(index) }>
                                <span>{client.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun legislator"
                    }
                </div>
                <button type="button" className="list-legislator-cta" 
                    onClick= { () => this.props.addClient() }>New client
                </button> 
            </div>
        );      
    }
}