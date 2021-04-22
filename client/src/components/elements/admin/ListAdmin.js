import React from 'react';

import "./ListAdmin.css";

export default class ListAdmin extends React.Component {

    render() {
        return (
            <div className="list-admin-body">
                <div className="list-admin-ul">
                    {this.props.state.listClients.length > 0 
                        ?
                        this.props.state.listClients.map((client, index) => (
                            <div className="list-admin" key={"adminKey"+index} onClick={ () => this.props.setClientFocus(index) }>
                                <span>{client.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun admin"
                    }
                </div>
                <button type="button" className="list-admin-cta" 
                    onClick= { () => this.props.addClient() }>New client
                </button> 
            </div>
        );      
    }
}