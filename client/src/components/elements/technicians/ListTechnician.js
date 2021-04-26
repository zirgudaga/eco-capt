import React from 'react';

import "./ListTechnician.css";

export default class ListTechnician extends React.Component {

    render() {
        return (
            <div className="list-technician-body">
                <div className="list-technician-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <button className="list-technician-btn" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                {element.description}
                            </button>  
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