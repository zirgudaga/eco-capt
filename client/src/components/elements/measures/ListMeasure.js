import React from 'react';

import "./ListMeasure.css";

export default class ListMeasure extends React.Component {

    render() {
        return (
            <div className="list-measure-body">
                <div className="list-measure-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <button className="list-measure-btn" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                {element.description}
                            </button>  
                        ))
                        :
                        " Aucun measure"
                    }
                </div>
                <button type="button" className="list-cta" 
                    onClick= { () => this.props.addElement() }>New measure
                </button> 
            </div>
        );      
    }
}