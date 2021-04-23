import React from 'react';
import './MainLegislator.css';

import HomeLegislator from '../elements/legislator/HomeClient.js';
import FocusLegislator from '../elements/legislator/FocusClient.js';
import ListLegislator from '../elements/legislator/ListClient.js';
import FormLegislator from '../elements/legislator/FormClient.js';

export default class MainLegislator extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            listElements: [],
            selectedElement: -1,
            elementToUpdate: null,
            isNew: false,
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
        this.getAllElement();
    }

    getAllElement = async () => {
        const { ledgerContract, accounts } = this.props.state;

        if(ledgerContract != null){
            let { listElements } = this.state;

            ledgerContract.getPastEvents('LedgerUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index=0;
                let _legislatorAddress = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Legislator"){     
                        _legislatorAddress = myEvent.returnValues['_target'];
                        listElements[index] = await ledgerContract.methods._legislators(_legislatorAddress).call({from:accounts[0]});
                        listElements[index].legislatorId = index;
                        listElements[index].legislatorAddress = _legislatorAddress;
                        index ++;
                    }       
                }
                this.setState({ listElements });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeLegislator state={this.props.state}/>);
            
            case "Focus" : return (<FocusLegislator 
                state={this.props.state}
                myElement={this.state.listElements[this.state.selectedElement]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
                addElement= {() => {this.showFormAddElement(true, false);}}
            />);

            case "New" : return (<FormLegislator 
                state={this.props.state}
                elementToUpdate={this.state.elementToUpdate}
                isNew={this.state.isNew}
                close={()=>{this.showFormAddElement(false, false)}}
            />);
            
            default: return (<HomeLegislator state={this.props.state}/>);
        }
    }

    showFormAddElement = (isOpen, isNew) => {
        let elementToUpdate=null;
        
        if(isOpen){
            if(this.state.selectedElement > -1){
                elementToUpdate=this.state.listElements[this.state.selectedElement];
            }

            this.setState({ currentMainSelect: "New", isNew: isNew, elementToUpdate: elementToUpdate});
            return;
        }

        if(this.state.selectedElement > -1){
            this.setState({ currentMainSelect : "Focus" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusElement = (index) => {
        this.setState({ selectedElement: index, currentMainSelect : "Focus" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListClient 
                        state={this.state}
                        addElement= {() => {this.showFormAddElement(true, true);}}
                        setElementFocus = {(index) => {this.showFocusElement(index);}}
                    />
                </main>
            </div>
        );
    }
}
