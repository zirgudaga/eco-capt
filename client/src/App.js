import React, { Component } from "react";
import Home from "./components/Home.js"
import DappsClient from "./components/DappsClient.js";
import DappsTesteur from "./components/DappsTesteur.js";
import NavBar from "./components/NavBar.js"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import ClientContract from "./contracts/ClientContract.json";
import getWeb3 from "./getWeb3.js";

import "./App.css";

class App extends Component {

    state = { 
        web3: null, 
        accounts: null, 
        contractFoundation: null, 
        contractTarget: null, 
        isOwner: false,
        myEvents: null,        
        listServices: [],
    };

    componentDidMount = async () => {

        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();

            const deployedNetwork = ClientContract.networks[networkId];
            const contract = new web3.eth.Contract(
                ClientContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            const contractTarget = deployedNetwork.address;
            console.log("Adresse contract : ", deployedNetwork.address);

            this.setState({ web3, accounts, contract, contractTarget});  

        } catch (error) {
            // Catch any errors for any of the above operations.
            //alert(`Failed to load web3, accounts, or contract. Check console for details.`);
            console.error(error);
        }
    };

    render() {
        return (
            <div className="App">
                <div className="global"> 
                    <Router>
                        <Switch>
                            <Route path="/appClient" exact>
                                <DappsClient
                                    state={this.state}
                                >
                                </DappsClient>                                    
                            </Route>

                            <Route path="/appTesteur" exact>
                                <DappsTesteur
                                    state={this.state}
                                >
                                </DappsTesteur>                                    
                            </Route>
                        
                            <Route path="/" exact>
                                <Route path="/" exact/>
                                    <NavBar>
                                        
                                    </NavBar>
                                    <Home>

                                    </Home>
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
