import React from 'react';

import "./ListTechnician.css";

export default class ListTechnician extends React.Component {

    render() {
        return (
            <div className="list-body">
                <div className="list-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <div className="list" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                <span>{element.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun technician"
                    }
                </div>
                <button type="button" className="list-cta" 
                    onClick= { () => this.props.addElement() }>New technician
                </button> 
            </div>
        );      
    }
}