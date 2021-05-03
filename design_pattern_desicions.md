# Design Pattern Decisions

This section explains why we chose the design patterns we are using in the code. 


- Behavioral Patterns
    - [x] **Guard Check**: Ensure that the behavior of a smart contract and its input parameters are as expected.
    - [x] State Machine: Enable a contract to go through different stages with different corresponding functionality exposed.
    - [ ] **Oracle**: Gain access to data stored outside of the blockchain.
    - [ ] Randomness: Generate a random number of a predefined interval in the deterministic environment of a blockchain.
- Security Patterns
    - [x] **Access Restriction**: Restrict the access to contract functionality according to suitable criteria.
    - [ ] Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.
    - [ ] Secure Ether Transfer: Secure transfer of ether from a contract to another address.
    - [ ] **Pull over Push**: Shift the risk associated with transferring ether to the user.
    - [x] Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.
- Upgradeability Patterns
    - [ ] Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
    - [ ] Eternal Storage: Keep contract storage after a smart contract upgrade.
- Economic Patterns
    - [ ] String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.
    - [x] Tight Variable Packing: Optimize gas consumption when storing or loading statically-sized variables.
    - [x] Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

[Reference](https://fravoll.github.io/solidity-patterns/)

## Guard Check

Through the use of several **modifiers**, we verify that functions are properly called by checking data validation. For example :

```
    modifier isServiceActive(uint _serviceId) {
        require(_serviceId < _serviceIdCounter.current(), "Service not exist"); 
        require(_services[_serviceId].isActive, "Service off line"); 
        _;
    }

    modifier onlyCustomer() {
        require (_myConfig.customerAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }
```

## State Machine

Our contracts do not aim at ordering a workflow, the **State Machine** focuses on actions availabilities.
Does a **service** has an **active status** ? is the **Rule** **active** ?
Those states are consulted by the Guard Check and modified only by authorized individuals :

```
    function toggleContract()
        onlyOwner() external {
        emit ContractUpdate("Contract on/off", msg.sender);
        _myConfig.isActive = !_myConfig.isActive;
    }
```    

## Oracle

Our Dapp is based on collecting data by sensors. Those data are processed by a trusted server which were installed by a  TechMaster we certified. This is why we don't used any **Oracle**.

## Randomness

Our Dapp doesn't need any random data. But if necessary, our bridge would be a perfect fit.

## Access Restriction

As define in the **Guard Check** section, each **CustomerContract** grants specific addresses access to certain functions :

```
     /**
     * @dev Structure of Service
     * @notice Feature_V2 
     */
    struct Service {
        bytes8 version;
        bytes8 measureType;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        string description;
        address bridgeAddress;
        address techMasterAddress;
        address legislatorAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter iotIdCounter;     
    }
```    

Only very specific users can define those addresses as valid :
```
    /**
     * @dev set a TechMasterAddress
     * @param _serviceId index of service 
     * @param _techMasterAddress techMaster's address
     */
    function setTechMasterAddress(
        uint _serviceId,
        address _techMasterAddress)
        isContractActive() isServiceActive(_serviceId) onlyOwner() external {  
        
        _services[_serviceId].techMasterAddress = _techMasterAddress;

        emit ServiceUpdate(_serviceId, "TechMaster Address update", msg.sender);
    }    
```   

Our **Guard Check** also operates in those functions.

## Checks Effects Interactions

Actions are already restricted by user and by address.

## Secure Ether Transfer

*Not treated by our Dapp*

## Pull over Push

*Not treated by our Dapp*

## Emergency Stop

*Our dapp do not provide any ETH deposit/transfer.* The **Owner** can deactivate the **CustomerContract** if he does not comply to the Eco-Capt guidelines.

## Proxy Delegate

*Not used in our projet*

## Eternal Storage

We anticipated that each **CustomerContract** would be versioned. Every data is stored and accessible even if a customer signed a new contract that offers more functionalities. Our **Config** struct is responsible for insuring this in the future.

```
    /**
    * @dev Structure of Configuration
    * @notice Version and status of activation
    * @notice Link to other contract
    */
    struct Config {
        bytes8 version;
        address _ledgerAddress;
        address _ecpTokenAddress;        
        uint64 prevContractDate;
        uint64 nextContractDate;
        address customerAddress;
        address prevContract;
        address nextContract;
        bool isActive;
    }
```

## String Equality Comparison

For the **KYC** part scheduled in the roadmap, we will implement String Equality Comparison.


## Tight Variable Packing


Variables order in our structs is build to pack various variables sizes :

```
     /**
     * @dev Structure of Service
     * @notice Feature_V2 
     */
    struct Service {
        bytes8 version;
        bytes8 measureType;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        string description;
        address bridgeAddress;
        address techMasterAddress;
        address legislatorAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter iotIdCounter;     
    }
```

This best practice is in effect.
Data are compiled in **bytes32**, even if they are composite.

```
    // struct MeasureHeader (32) { 
    //   //V0.1     XX.XX.XX    00.01.00
    //   version : bytes8
    //   date : YYYYmmddHHii : byte12
    //   measureType : bytes8 - CODE : 4 number/letter for the physical nature - 4 number/letter for the version
    //   timeCode : bytes1 (hourly, daily) Y m d H i
    //   nbTime : bytes3 
    // }
```

## Memory Array Building

In order to save gaz, we use systematically the **view** attribute for all our getters :

```
 /**
     * @dev allows the dApp to process user's type and display the correct interface
     * @param _myTypeUser uint user's type 
     */  
    function rootingApps(
        address _userAddress)
        external view returns(uint _myTypeUser){
        /*
            1 : Admin
            2 : Client
            3 : Législateur
            4 : Techmaster
            5 : Bridge
            9 : Public
        */

        [...]
    }
```    

On the other hand, to keep saving gaz, we prefer using **mapping** in order to avoid using loops.
We do not have any loop in our code.

```
    Config public _myConfig;
    mapping(uint => Service) public _services;
    Counters.Counter public _serviceIdCounter;
    mapping(uint => mapping(bytes6 => Iot)) public _serviceIots;
    mapping(uint => Rule) public _serviceRules;
    Counters.Counter public _ruleIdCounter;
    IECPToken private _ECPToken;
```    

To optimize our smart contracts, we use Events to store our measures.
Once sent by the bridge, they are not used anymore for any calculation and are left untouched.
Our Dapp can access those data without cluttering it up.