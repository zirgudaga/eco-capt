import React from 'react';

import "./ListRule.css";

export default class ListRule extends React.Component {

    render() {

        return (
            <div className="list-rule-body">
                <div className="list-rule-ul">
                    {this.props.state.listRules.length > 0 
                        ?
                        this.props.state.listRules.map((rule, index) => (

                            <div className="alert-malibu" key={"RuleKey"+index} onClick={ () => this.props.setRuleFocus(index) }><span>{rule.description}</span> 
                                <span className="alert-notif">{rule.alertIdCounter['_value']}</span>
                            </div>  
                        ))
                        :
                        " Aucun Rule"
                    }
                </div>
                <button type="button" className="list-rule-cta" 
                    onClick= { () => this.props.addRule() }>New Rule
                </button> 
            </div>
        );      
    }
}