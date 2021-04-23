import React from 'react';

import "./ListService.css";

export default class ListService extends React.Component {

    affAdd = () => {
        let { isAddable } = this.props.state;

        if (isAddable){
            return(
                <button type="button" className="list-service-cta" 
                onClick= { () => this.props.addService() }>New service
                </button> 
            );
        }
    }

    render() {
        return (
            <div className="list-service-body">
                <div className="list-service-ul">
                    {this.props.state.listServices.length > 0 
                        ?
                        this.props.state.listServices.map((service, index) => (
                            <div className="list-service" key={"serviceKey"+index} onClick={ () => this.props.setServiceFocus(index) }><span>{service.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun service"
                    }
                </div>
                {this.affAdd()}
            </div>
        );      
    }
}