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
            listClients: [],
            selectedClient: -1,
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
        this.getAllClients();
    }

    getAllClients = async () => {
        const { ledgerContract, accounts } = this.props.state;

        if(ledgerContract != null){
            let { listClients } = this.state;

            ledgerContract.getPastEvents('LedgerUpdate', { fromBlock: 0,  toBlock: 'latest'}, function(error, events){ })
            .then(async (myEvents) => {
                let index=0;
                let _customerAddress = '';
                for(let myEvent of myEvents){
                    if(myEvent.returnValues['_message'] == "New Customer"){     
                        _customerAddress = myEvent.returnValues['_target'];
                        listClients[index] = await ledgerContract.methods._customers(_customerAddress).call({from:accounts[0]});
                        listClients[index].clientId = index;
                        listClients[index].clientAddress = _customerAddress;
                        index ++;
                        
                    }       
                }
                this.setState({ listClients });  
            });
        }        
    };    

    selectedMainLauncher = () => {

        switch(this.state.currentMainSelect){
            case "Home" : return (<HomeClient state={this.props.state}/>);
            case "FocusClient" : return (<FocusClient 
                state={this.props.state}
                myClient={this.state.listClients[this.state.selectedClient]} 
                goContract = {(addr) => {this.props.goContract(addr);}}
            />);
            case "NewClient" : return (<FormClient 
                state={this.props.state} 
                close={()=>{this.showFormAddClient(false)}}
            />);
            
            default: return (<HomeClient state={this.props.state}/>);
        }
    }

    showFormAddClient = (isOpen) => {
        if(isOpen){
            this.setState({ currentMainSelect: "NewClient" });
            return;
        }

        if(this.state.selectedClient > -1){
            this.setState({ currentMainSelect : "FocusClient" });
        }else{
            this.setState({ currentMainSelect : "Home" });
        }
    }

    showFocusClient = (index) => {
        this.setState({ selectedClient: index, currentMainSelect : "FocusClient" });
    }

    render() {
        return (
            <div className="main-content">
                <main className="client-main-content wrap">     
                    {this.selectedMainLauncher()}  
                    <ListClient 
                        state={this.state}
                        addClient= {() => {this.showFormAddClient(true);}}
                        setClientFocus = {(index) => {this.showFocusClient(index);}}
                    />
                </main>
            </div>
        );
    }
}
