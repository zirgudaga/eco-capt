import React, { Component } from "react";
import './App.css';
import Welcome from "./Components/Layouts/Welcome.js";
import WelcomeNavBar from "./Components/Layouts/WelcomeNavBar.js";

import DashboardClient from "./Components/Customer/DashboardClient.js";
import DashboardTester from "./Components/Customer/Tools/DashboardTester.js";
//import Counter from './Components/Counter';

import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import CustomerContract from "./contracts/CustomerContract.json";

import getWeb3 from "./getWeb3.js";

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

          const deployedNetwork = CustomerContract.networks[networkId];

          // ADDD
          if(networkId == 3){
                deployedNetwork.address = "0x77D1aE180104A257a6B208Bc04bAae41C0F26bE8";
          }
          

          const contract = new web3.eth.Contract(
                CustomerContract.abi,
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
                <DashboardClient
                    state={this.state}
                >
                </DashboardClient>                                    
              </Route>
              <Route path="/appTesteur" exact>
                <DashboardTester
                    state={this.state}
                >
                </DashboardTester>                                    
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