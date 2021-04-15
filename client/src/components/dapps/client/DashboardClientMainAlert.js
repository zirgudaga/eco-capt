import React from 'react';
import './DashboardClientMain.css';
import './DashboardClientMainAlert.css'

import HomeRule from '../../elements/Alerts/HomeRule.js';
import FocusRule from '../../elements/Alerts/FocusRule.js';
import ListRule from '../../elements/Alerts/ListRule.js';
import FormRule from '../../elements/Alerts/FormRule.js';


export default class DashboardClientMainAlert extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listRules: [],
            selectedRule: -1,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 1000);
    }

    refresh = () => {
        this.getAllRules();
    }

    getAllRules = async () => {
        const { contract } = this.props.state;

        if(contract != null){
            let { listRules } = this.state;
            listRules = await contract.methods.getAllAlertConfigs().call();
            for(let index in listRules){
                listRules[index].ruleId = index;
            }
            this.setState({ listRules });  
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
            <div className="">
                <div className="main-content">
                    <header>
                        <div className="menu-toggle">
                            <label className="sidebar-toggle">
                                <span className="las la-bars"></span>
                            </label>
                        </div>

                        <div className="header-icons">
                            <span className="las la-search" onClick={()=>{this.refresh();}}></span>
                            <span className="las la-bookmark"></span>
                            <span className="las la-sms"></span>
                        </div>
                    </header>
                    <div className="row">
                        <main className="rule-main-content">     
                            {this.selectedMainLauncher()}  
                            <ListRule 
                                state={this.state}
                                addRule= {() => {this.showFormAddRule(true);}}
                                setRuleFocus = {(index) => {this.showFocusRule(index);}}
                            />
                        </main>
                    </div>
                </div>
            </div>
        );
    }
}
