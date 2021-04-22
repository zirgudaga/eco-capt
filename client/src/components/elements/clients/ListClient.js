import React from 'react';

import "./ListClient.css";

export default class ListClient extends React.Component {

    render() {
        return (
            <div className="list-client-body">
                <div className="list-client-ul">
                    {this.props.state.listClients.length > 0 
                        ?
                        this.props.state.listClients.map((client, index) => (
                            <div className="list-client" key={"clientKey"+index} onClick={ () => this.props.setClientFocus(index) }>
                                <span>{client.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun client"
                    }
                </div>
                <button type="button" className="list-client-cta" 
                    onClick= { () => this.props.addClient() }>New client
                </button> 
            </div>
        );      
    }
}