# eco-capt
 Alyra's 2021 up and coming final project !


## Contributors

- [Hélène Bunel](https://github.com/Helene-mb)
- [Édouard Vahanian](https://github.com/edvahn)
- [Daniel Villa Monteiro](https://github.com/zirgudaga)
- [Jérémy Karsenty](https://github.com/jkarsenty)

# Installation

- Install npm
- Install the Solidity Compiler version 0.8.0
- Clone the Github repository

```
cd $DEV
```

Clone the repository

```
git clone git@github.com:zirgudaga/eco-capt.git
cd eco-capt
```

- Install the npm packages for the back-end and the front-end

Install the npm packages for the back-end
```
npm install
```

Install the npm packages for the front-end
```
npm --prefix client/ install
```

# Configuration

## Environment Parameters

You will need to create a .env file in the project's root folder. It will store specific deployment parameters and your Infura project identifier.
1. Create a .env in your project folder
2. Replace the following parameters with yours:
```
MNEMONIC          = "Your_own_12_words_seed_here"
INFURA_PROJECT_ID = "Your_infura_project_id_here"
```

ℹ️ Keep in mind to surround each value with double quotes.

## Deploy   

You need to deploy both our smart-contracts (CustomerContract.sol and LedgerContract.sol) and the ReactJS app - DApp (front-end).

## Deploy Back-End

The smart-contracts are deployed in the following order:
- LedgerContract.sol
- CustomerContract.sol

## Deploy Dev

### Local Deploy
```
npm truffle deploy --network ganache
```

## Deploy on a Test Network

### Deploy the contracts on the ropsten test network
```
npm truffle deploy --network ropsten
```

Update the contract addresses in the file doc/deployed_addresses.md.

## Contracts Addresses
The file doc/deployed_addresses.md contains the address of each smart-contract deployed on the Ropsten testnet.

## Deploy Front-End

Local Deployment:
Nothing to do.

## Run

Run the local DApp:
In order to run the Front-End application on your local machine:

```
cd client 
npm start
```

## Open the App

Open the local DApp: https://localhost:3000/
Open the DApp deployed on Heroku (remote): https://eco-capt.herokuapp.com/appClient/ (to interact with the contracts deployed on a TestNet)

## Test

[This page](https://github.com/zirgudaga/eco-capt/blob/main/tests_explication.md) explains what we test and how.

Run ganache on port 7545 beforehand
```
npm truffle deploy --reset --network ganache

npm truffle test # Run the unit and integration tests
```

## Code Coverage

Runs the tests then displays a report of the smart-contracts code coverage.
```
npm run coverage
```

## Gas Report

To get a report of the gas consumed by the smart-contracts while running the tests.
```
npm run gas
```

## Decisions

The Design Pattern Decisions are explained in details here : https://github.com/zirgudaga/eco-capt/blob/main/design_pattern_desicions.md



## Project main goal

📌  This project aims at collecting industrial emissions datas through sensors and stores them on the Ethereum blockchain.
Sensors are connected to the smart contract via a bridge which turns raw data into storable information.
The objective is twofold : 
- First, to provide a follow-up to the manufacturers and allow them to show the various legislators that they respect environmental standards in force.
- Then, facilitate legislator's monitoring through the use of red flags.

The data is therefore available to all, immutable.

### Service development process.

- A new customer can register a new service through a form.
- This form collects a description, a choice of measurement type, the version of the service and the frequency of recordings.
- Once a service is deployed, the foundation can designate a TechMaster.
- The TechMaster will have the role of installing the bridge, the bridge address and the the MAC addresses connected to this bridge.
- The client can set alert thresholds (form).

### Progression

CustomerContract delivered  🚀
LedgerContract delivered  🚀
Tests produced

### Visual Studio Code  🖥️

### Coding languages : Solidy, ReactJS

### Framework : Truffle unbox React 

### Network : Ganache, Ropsten

## Customer Contract

The smart contract defines the following events : 
```
event ContractUpdate(string _message, address _author);      
event ServiceUpdate(uint _serviceId, string _message, address _author);  
event ServiceRulesUpdate(uint _serviceId, uint _ruleId, string _message, address _author); 
event ServiceIotUpdate(uint _serviceId, bytes6 _iotId, string _message, address _author); 
event MeasureReceive(uint _serviceId, bytes32 _header, bytes32 _body, address _author); 
event AlertReceive(uint _serviceId, uint _ruleId, bytes32 _alert, address _author);  
```

## Ledger Contract
The smart contract defines the following events : 
```
event LedgerUpdate(string _message, address _target, address _author);  
event TypeMeasureUpdate(string _message, bytes8 _target, address _author);  
```
