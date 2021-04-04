import React, { Component } from "react";
//import Home from "./components/Home.js"
//import NavBar from "./components/NavBar.js"
import Dapps from "./components/Dapps.js"

import "./App.css";

class App extends Component {
  state = { storageValue: 0, web3: null, accounts: null, contract: null };
  render() {
    return (
      <div className="App">
        <div className="global home"> 
          {/* <NavBar/>  */}
          {/* <AdminInterface></AdminInterface> */}
          <Dapps/>
          {/* <Home></Home> */}
        </div>
      </div>
    );
  }
}

export default App;
