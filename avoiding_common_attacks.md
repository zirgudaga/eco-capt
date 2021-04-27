# avoiding_common_attacks.md

- [x] Re-Entrancy
- [x] Arithmetic Overflow and Underflow
- [ ] Self Destruct
- [ ] Accessing Private Data
- [ ] Delegatecall
- [ ] Source of Randomness
- [ ] Denial of Service
- [ ] Phishing with tx.origin
- [ ] Hiding Malicious Code with External Contract
- [ ] Honeypot
- [ ] Front Running
- [ ] Block Timestamp Manipulation
- [ ] Signature Replay

📌 Security checks currently in place :

## Re-Entrancy

- No possible re-entrancy because we do not use any outside smart contract. **LedgerContract** address is displayed when deployed and will not be modified.

- **isOwner** is used everystep of the way as regard to keep contract functions.

- Sets of **modifier** are in place to limit the access to certain functionalities.
**Toggle Status** and **Id Checks** are in place:

   ```modifier isContractActive() {
        require(_myConfig.isActive, "Contract off line");
        _;
    }

    modifier isServiceActive(uint _serviceId) {
        require(_serviceId < _serviceIdCounter.current(), "Service not exist"); 
        require(_services[_serviceId].isActive, "Service off line"); 
        _;
    }

    modifier isRulesActive(uint _ruleId) {
        require(_ruleId < _ruleIdCounter.current(), "Rules not exist"); 
        require(_serviceRules[_ruleId].isActive, "Rules off line"); 
        _;
    }

    modifier onlyCustomer() {
        require (_myConfig.customerAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyBridge(uint _serviceId) {
        require (_services[_serviceId].bridgeAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyTechMaster(uint _serviceId) {
        require (_services[_serviceId].techMasterAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyLegislator(uint _serviceId) {
        require (_services[_serviceId].legislatorAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }```

## Arithmetic Overflow and Underflow

The 2 cases where we use arithmetic operations are for index implemntation by mapping via the Counter.sol class from the **OpenZepellin** which protects himself from underflow. We no longer use SaFeMath from @openzeppelin since we have upgraded Solidity to 0.8 which handles this natively.

## Accessing Private Data

Our solution is based on Open Data, there are no sensible data, everything is public.

