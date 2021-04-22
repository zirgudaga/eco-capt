import React from 'react';

import "./ListLegislator.css";

export default class ListLegislator extends React.Component {

    render() {
        return (
            <div className="list-legislator-body">
                <div className="list-legislator-ul">
                    {this.props.state.listLegislators.length > 0 
                        ?
                        this.props.state.listLegislators.map((legislator, index) => (
                            <div className="list-legislator" key={"legislatorKey"+index} onClick={ () => this.props.setLegislatorFocus(index) }>
                                <span>{legislator.description}</span> 
                            </div>  
                        ))
                        :
                        " Aucun legislator"
                    }
                </div>
                <button type="button" className="list-legislator-cta" 
                    onClick= { () => this.props.addLegislator() }>New Legislator
                </button> 
            </div>
        );      
    }
}