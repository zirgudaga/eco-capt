import React, { Component } from "react";
import Home from "./components/Home.js"
import Dapps from "./components/Dapps.js";  
import NavBar from "./components/NavBar.js"
import {BrowserRouter as Router, Route, Switch} from "react-router-dom";

import "./App.css";

class App extends Component {
    state = { storageValue: 0, web3: null, accounts: null, contract: null };
    render() {
        return (
            <div className="App">
                <div className="global home"> 
                    <Router>
                        <NavBar />
                        <Switch>
                            <Route path="/" exact component={Home}/>
                            <Route path="/app" exact component={Dapps}/>
                            <Route path="/" compoment={() => <div> ERROR 404 </div>}/>
                        </Switch>
                    </Router>
                </div>
            </div>
        );
    }
}

export default App;
