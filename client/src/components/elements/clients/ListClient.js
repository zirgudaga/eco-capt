import React from 'react';

import "./ListClient.css";

export default class ListClient extends React.Component {

    render() {
        return (
            <div className="list-body">
                <div className="list-ul">
                    {this.props.state.listElements.length > 0 
                        ?
                        this.props.state.listElements.map((element, index) => (
                            <button className="list-button" key={"elementKey"+index} onClick={ () => this.props.setElementFocus(index) }>
                                {element.description} 
                            </button>  
                        ))
                        :
                        " No customer "
                    }
                </div>
                {(this.props.state.myTypeUser==='1') &&
                    <button type="button" className="list-cta" 
                        onClick= { () => this.props.addElement() }>New customer
                    </button> 
                }
            </div>
        );      
    }
}