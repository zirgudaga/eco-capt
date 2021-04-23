import React from 'react';
import './MainAlert.css'

import HomeRule from '../elements/alerts/HomeRule.js';
import FocusRule from '../elements/alerts/FocusRule';
import ListRule from '../elements/alerts/ListRule.js';
import FormRule from '../elements/alerts/FormRule.js';


export default class Alert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listRules: [],
            isAddable: false,
            selectedRule: -1,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        let { isAddable } = this.state;
        const { myTypeUser } = this.props.state;

        if ((myTypeUser === '1') || (myTypeUser === '2') || (myTypeUser === '3')){
            isAddable = true;
            this.setState({ isAddable });  
        }

        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
        this.getAllRules();
    }

    getAllRules = async () => {
        const { customerContract, accounts } = this.props.state;

        if(customerContract != null){
            let { listRules } = this.state;
            listRules=[];

            customerContract.getPastEvents('ServiceRulesUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index;
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Rule"){
                        index = myEvent.returnValues['_ruleId'];
                        listRules[index] = await customerContract.methods._serviceRules(index).call({from:accounts[0]});
                        listRules[index].ruleId = index;
                    }       
                }
                this.setState({ listRules });  
            });
        }     
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeRule state={this.props.state}/>);
            case "FocusRule" : return (<FocusRule 
                state={this.props.state}
                myRule={this.state.listRules[this.state.selectedRule]} 
            />);
            case "NewRule" : return (<FormRule 
                state={this.props.state} 
                close={()=>{this.showFormAddRule(false)}}
            />);
            
            default: return (<HomeRule state={this.props.state}/>);
        }
    }

    showFormAddRule = (isOpen) => {
        if(isOpen){
            this.setState({ currentMainSelect: "NewRule" });
            return;
        }

        if(this.state.selectedRule > -1){
            this.setState({ currentMainSelect : "FocusRule" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusRule = (index) => {
        this.setState({ selectedRule: index, currentMainSelect : "FocusRule" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="rule-main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListRule 
                        state={this.state}
                        addRule= {() => {this.showFormAddRule(true);}}
                        setRuleFocus = {(index) => {this.showFocusRule(index);}}
                    />
                </main>
            </div>
        );
    }
}
