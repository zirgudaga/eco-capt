import React from 'react';
import './MainBridge.css';

import HomeBridge from '../elements/bridges/HomeBridge.js';
import FocusBridge from '../elements/bridges/FocusBridge.js';
import ListBridge from '../elements/bridges/ListBridge.js';
import FormBridge from '../elements/bridges/FormBridge.js';

export default class MainBridge extends React.Component {

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
                let _bridgeAddress = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Bridge"){    
                        _bridgeAddress = myEvent.returnValues['_target'];
                        listElements[index] = await ledgerContract.methods._bridges(_bridgeAddress).call({from:accounts[0]});
                        listElements[index].bridgeId = index;
                        listElements[index].bridgeAddress = _bridgeAddress;
                        index ++;
                    }       
                }
                this.setState({ listElements });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeBridge state={this.props.state}/>);
            
            case "Focus" : return (<FocusBridge  
                state={this.props.state}
                myElement={this.state.listElements[this.state.selectedElement]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
                addElement= {() => {this.showFormAddElement(true, false);}}
            />);

            case "New" : return (<FormBridge  
                state={this.props.state}
                elementToUpdate={this.state.elementToUpdate}
                isNew={this.state.isNew}
                close={()=>{this.showFormAddElement(false, false)}}
            />);
            
            default: return (<HomeBridge state={this.props.state}/>);
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
                    <ListBridge  
                        state={this.state}
                        addElement= {() => {this.showFormAddElement(true, true);}}
                        setElementFocus = {(index) => {this.showFocusElement(index);}}
                    />
                </main>
            </div>
        );
    }
}
