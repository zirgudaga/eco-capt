import React from 'react';

import "./ListBridge.css";

export default class ListBridge extends React.Component {

    render() {
        return (
            <div className="list-bridge-body">
                <div className="list-bridge-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <button className="list-bridge-btn" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                {element.description}
                            </button>  
                        ))
                        :
                        " No bridges "
                    }
                </div>
                <button type="button" className="list-cta" 
                    onClick= { () => this.props.addElement() }>New bridge
                </button> 
            </div>
        );      
    }
}