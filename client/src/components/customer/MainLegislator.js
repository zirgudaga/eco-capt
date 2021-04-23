import React from 'react';
import './MainLegislator.css';

import HomeLegislator from '../elements/legislator/HomeLegislator.js';
import FocusLegislator from '../elements/legislator/FocusLegislator.js';
import ListLegislator from '../elements/legislator/ListLegislator.js';
import FormLegislator from '../elements/legislator/FormLegislator.js';

export default class MainClient extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listLegislators: [],
            selectedLegistalor: -1,
            currentMainSelect: "Home",
            errorMessage: '',
        };
    }

    componentDidMount = () => {
        setInterval(()=>{
            this.refresh();
        }, 2000);
    }

    refresh = () => {
        this.getAllLegistalors();
    }

    getAllLegistalors = async () => {
        const { ledgerContract, accounts } = this.props.state;

        if(ledgerContract != null){
            let { listLegislators } = this.state;

            ledgerContract.getPastEvents('LedgerUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index=0;
                let _legislatorAddress = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Legislator"){     
                        _legislatorAddress = myEvent.returnValues['_target'];
                        listLegislators[index] = await ledgerContract.methods._legislators(_legislatorAddress).call({from:accounts[0]});
                        listLegislators[index].legislatorId = index;
                        listLegislators[index].legislatorAddress = _legislatorAddress;
                        index ++;
                        
                    }       
                }
                this.setState({ listLegislators });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeLegislator state={this.props.state}/>);
            case "FocusLegislator" : return (<FocusLegislator 
                state={this.props.state}
                myLegislator={this.state.listLegislators[this.state.selectedLegistalor]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
            />);
            case "NewLegislator" : return (<FormLegislator 
                state={this.props.state} 
                close={()=>{this.showFormAddLegislator(false)}}
            />);
            
            default: return (<HomeLegislator state={this.props.state}/>);
        }
    }

    showFormAddLegislator = (isOpen) => {
        if(isOpen){
            this.setState({ currentMainSelect: "NewLegislator" });
            return;
        }

        if(this.state.selectedLegistalor > -1){
            this.setState({ currentMainSelect : "FocusLegislator" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusLegislator = (index) => {
        this.setState({ selectedLegistalor: index, currentMainSelect : "FocusLegislator" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="legislator-main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListLegislator 
                        state={this.state}
                        addLegislator= {() => {this.showFormAddLegislator(true);}}
                        setLegislatorFocus = {(index) => {this.showFocusLegislator(index);}}
                    />
                </main>
            </div>
        );
    }
}
