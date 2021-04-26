import React from 'react';

import "./ListLegislator.css";

export default class ListLegislator extends React.Component {

    render() {
        return (
            <div className="list-legislator-body">
                <div className="list-legislator-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <button className="list-legislator-btn" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                {element.description}
                            </button>  
                        ))
                        :
                        " Aucun legislator"
                    }
                </div>
                <button type="button" className="list-cta" 
                    onClick= { () => this.props.addElement() }>New legislator
                </button> 
            </div>
        );      
    }
}