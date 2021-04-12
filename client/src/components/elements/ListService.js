import React from 'react';

import "./ListService.css";

export default class ListService extends React.Component {

    render() {
        return (
            <div className="list-service-body">
                <div className="list-service-ul">
                    {this.props.state.listServices.length > 0 
                        ?
                        this.props.state.listServices.map((service, index) => (
                            <p key={"serviceKey"+index}><input type="button" 
                            value={service.description} 
                            onClick={ () => this.props.setServiceFocus(index) }/></p>       
                        ))
                        :
                        " Aucun service"
                    }
                </div>
                <button type="button" className="list-service-cta" 
                    onClick= { () => this.props.addService() }>New service
                </button> 
            </div>
        );      
    }
}