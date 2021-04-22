import React from 'react';

import "./ListTechnician.css";

export default class ListTechnician extends React.Component {

    render() {
        return (
            <div className="list-technician-body">
                <div className="list-technician-ul">
                    {this.props.state.listClients.length > 0 
                        ?
                        this.props.state.listClients.map((client, index) => (
                            <div className="list-technician" key={"technicianKey"+index} onClick={ () => this.props.setClientFocus(index) }>
                                <span>{client.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun technician"
                    }
                </div>
                <button type="button" className="list-technician-cta" 
                    onClick= { () => this.props.addClient() }>New technician
                </button> 
            </div>
        );      
    }
}