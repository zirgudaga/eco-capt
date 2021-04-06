import React from 'react';

import ClientContract from "../contracts/ClientContract.json";
import getWeb3 from "../getWeb3.js";
//import {addToList, removeToList} from "../utils.js"
import LeftSide from "./LeftSide.js";
import DashboardTester from "./DashboardTester.js";

export default class Dapps extends React.Component {

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

            console.log("Adresse contract : ", deployedNetwork.address)


            this.setState({ web3, accounts, contract});  

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    render() {
        return (
            <main className="bg-gray-900">
                <div className="wrap">
                    <div className="flex w-full h-screen">
                        <LeftSide/> 
                        <DashboardTester state={this.state}/>
                    </div>
                </div>
            </main>
        )
    }
}