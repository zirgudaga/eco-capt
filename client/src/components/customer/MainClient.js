import React from 'react';
import './MainClient.css';

import HomeClient from '../elements/clients/HomeClient.js';
import FocusClient from '../elements/clients/FocusClient.js';
import ListClient from '../elements/clients/ListClient.js';
import FormClient from '../elements/clients/FormClient.js';

export default class MainClient extends React.Component {

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
                let _customerAddress = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Customer"){     
                        _customerAddress = myEvent.returnValues['_target'];
                        listElements[index] = await ledgerContract.methods._customers(_customerAddress).call({from:accounts[0]});
                        listElements[index].customerId = index;
                        listElements[index].customerAddress = _customerAddress;
                        index ++;
                    }       
                }
                this.setState({ listElements });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeClient state={this.props.state}/>);
            
            case "FocusClient" : return (<FocusClient 
                state={this.props.state}
                myElement={this.state.listElements[this.state.selectedElement]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
                addElement= {() => {this.showFormAddElement(true, false);}}
            />);

            case "NewClient" : return (<FormClient 
                state={this.props.state}
                elementToUpdate={this.state.elementToUpdate}
                isNew={this.state.isNew}
                close={()=>{this.showFormAddElement(false, false)}}
            />);
            
            default: return (<HomeClient state={this.props.state}/>);
        }
    }

    showFormAddElement = (isOpen, isNew) => {
        let elementToUpdate=null;
        
        if(isOpen){
            if(this.state.selectedElement > -1){
                elementToUpdate=this.state.listElements[this.state.selectedElement];
            }

            this.setState({ currentMainSelect: "NewClient", isNew: isNew, elementToUpdate: elementToUpdate});
            return;
        }

        if(this.state.selectedElement > -1){
            this.setState({ currentMainSelect : "FocusClient" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusElement = (index) => {
        this.setState({ selectedElement: index, currentMainSelect : "FocusClient" });
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
