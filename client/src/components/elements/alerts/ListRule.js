import React from 'react';

import "./ListRule.css";

export default class ListRule extends React.Component {

    affAdd = () => {
        let { isAddable } = this.props.state;

        if (isAddable){
            return(
                <button type="button" className="list-rule-cta" 
                    onClick= { () => this.props.addRule() }>New Rule
                </button> 
            );
        }
    }


    render() {
      
        return (
            <div className="list-rule-body">
                <div className="list-rule-ul">
                    {this.props.state.listRules.length > 0 
                        ?
                        this.props.state.listRules.map((rule, index) => (

                            <button className="alert-malibu" key={"RuleKey"+index} onClick={ () => this.props.setRuleFocus(index) }>
                                {rule.description}
                                <span className="alert-malibu-counter">{rule.alertIdCounter['_value']}</span>
                            </button>  
                        ))
                        :
                        " No Rules "
                    }
                </div>
                {this.affAdd()}
            </div>
        );      
    }
}