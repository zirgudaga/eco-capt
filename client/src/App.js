import React, { Component } from "react";
import './App.css';
import Welcome from "./components/layouts/Welcome.js";
import WelcomeNavBar from "./components/layouts/WelcomeNavBar.js";

import Dashboard from "./components/customer/Dashboard.js";

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import CustomerContract from "./contracts/CustomerContract.json";
import LedgerContract from "./contracts/LedgerContract.json";
import ECPToken from "./contracts/ECPToken.json";

import getWeb3 from "./getWeb3.js";

/*
    ADMIN : 0xC9881C29c6e203d6DFa38fC0e3B426C84cA70056
    TECHMASTER : 0xF00145F4277735F1444a131ED3eBe1d29EA17861
    LEGISLATEUR : 0x2AD915C4e78F9D6B6BBA1aa8A3b538e9c3712767
    CUSTOMER 1 : 0x703c9Aea1117aB92dFc1E82494d1388562AAAc2E
    CUSTOMER 2 : 0x79D147b737F3075c2b870061003E683a7A34c944
*/

/*
    1 : Admin
    2 : Client
    3 : Législateur
    4 : Techmaster
    5 : Public
*/

class App extends Component {

    state = { 
        web3: null, 
        accounts: null, 
        ledgerContract: null, 
        ledgerSafe:0,

        ecpTokenContract : null,
        ecpTokenAddress : null,

        customerContract: null,
        customerContractAddress: null,

        myTypeUser: 0,
        isOwner: false,
        myEvents: null,        
    };

    componentDidMount = async () => {

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = LedgerContract.networks[networkId];
            const ledgerContract = new web3.eth.Contract(
                LedgerContract.abi,
                deployedNetwork && deployedNetwork.address,
            );      
            
            const deployedNetwork2 = ECPToken.networks[networkId];
            const ecpTokenContract = new web3.eth.Contract(
                ECPToken.abi,
                deployedNetwork2 && deployedNetwork2.address,
            );  
            
            this.setState({ web3, accounts, ledgerContract, ecpTokenContract});  

        } catch (error) {
            // Catch any errors for any of the above operations.
            //alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }

        let { ledgerContract, ledgerSafe, ecpTokenContract, accounts, myTypeUser, ecpTokenAddress } = this.state;

        if(ledgerContract !== null){
            myTypeUser = await ledgerContract.methods.rootingApps().call({from:accounts[0]});
            ecpTokenAddress = await ledgerContract.methods.ecpTokenAddress().call({from:accounts[0]});          

            if(myTypeUser === '1'){
                ledgerSafe = await ecpTokenContract.methods.balanceOf(ledgerContract._address).call({from:accounts[0]});     
            }            

            if(myTypeUser === '2'){
                let myContract = await ledgerContract.methods._customers(accounts[0]).call({from:accounts[0]});
                this.goContract(myContract.contractAddress);
            }

            this.setState({ myTypeUser, ledgerSafe, ecpTokenAddress });
        }
      

    };

    goContract = (addr) => {
        let { customerContract, customerContractAddress, web3 } = this.state;

        customerContractAddress = addr;

        customerContract = new web3.eth.Contract(
            CustomerContract.abi,
            addr
        );   

        this.setState({ customerContract, customerContractAddress });
    }

    closeContract = () => {
        let { customerContract, customerContractAddress } = this.state;
        customerContract = null;
        customerContractAddress = null;
        this.setState({ customerContract, customerContractAddress });        
    }

    render() {
        return (
            <div className="App">
                <div className="global">
                    <Router>
                        <Switch>
                            <Route path="/app" exact>
                                <Dashboard
                                    state={this.state}
                                    goContract = {(addr) => {this.goContract(addr);}}
                                    contractClose = {() => this.closeContract()}
                                >
                                </Dashboard>                                    
                            </Route>

                            <Route path="/" exact>
                                <Route path="/" exact/>
                                    <WelcomeNavBar />
                                    <Welcome />
                                </Route>
                            <Route path="/" compoment={() => <div> ERROR 404 </div>}/>
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;