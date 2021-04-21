// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LedgerContract is Ownable {
    using Counters for Counters.Counter;

    struct Customer {
        string description;
        address contractAddress;
        uint siretNumber;
        bool isActive;
        bool exist;
    }

    struct Legislator {
        string description;
        uint siretNumber;        
        bool isActive;
        bool exist;        
    }

    struct TechMaster {
        string description;
        uint siretNumber;        
        bool isActive;
        bool exist;        
    }

    struct TypeMeasure{
	    string description;
        string info;
        bool isActive;
	    bool isAllowed;
        bool exist;        
    }

    event LedgerUpdate(string _message, address _target, address _author);  
    event TypeMeasureUpdate(string _message, bytes8 _target, address _author);  
  
    mapping(address => Customer) public _customers; 
    mapping(address => Legislator) public _legislators; 
    mapping(address => TechMaster) public _techMasters;
    mapping(bytes8 => TypeMeasure) public _typeMeasures;

    function setCustomer (
        string memory _description,
        address _customerAddress, 
        address _contratAddress,
        uint _siretNumber,
        bool _isActive) 
        onlyOwner() external {

        if(!_customers[_customerAddress].exist){
            emit LedgerUpdate("New Customer", _customerAddress, msg.sender);
        }else{
            emit LedgerUpdate("Update Customer", _customerAddress, msg.sender);
        }

        _customers[_customerAddress] = Customer(
        _description,
        _contratAddress,         
        _siretNumber,
        _isActive, 
        true);
    }

    function setLegislator (
        string memory _description,        
        address _legislatorAddress,
        uint _siretNumber,
        bool _isActive) 
        onlyOwner() external {

        if(!_legislators[_legislatorAddress].exist){
            emit LedgerUpdate("New Legislator", _legislatorAddress, msg.sender);
        }else{
            emit LedgerUpdate("Update Legislator", _legislatorAddress, msg.sender);
        }

        _legislators[_legislatorAddress] = Legislator(
        _description,
        _siretNumber,
        _isActive,
        true);   
    }    

    function setTechMaster (
        string memory _description,
        address _techMasterAddress,       
        uint _siretNumber,
        bool _isActive) 
        onlyOwner() external {

        if(!_techMasters[_techMasterAddress].exist){
            emit LedgerUpdate("New TechMaster", _techMasterAddress, msg.sender);
        }else{
            emit LedgerUpdate("Update TechMaster", _techMasterAddress, msg.sender);
        }

        _techMasters[_techMasterAddress] = TechMaster(
        _description,
        _siretNumber,
        _isActive,
        true);
    }    
    
    function setTypeMeasure (
        string memory _description,
        string memory _info,
        bytes8 _codeMeasure,
        bool _isActive,
        bool _isAllowed) 
        onlyOwner() external {  

        if(!_typeMeasures[_codeMeasure].exist){
            emit TypeMeasureUpdate("New TypeMesure", _codeMeasure, msg.sender);
        }else{
            emit TypeMeasureUpdate("Update TypeMesure", _codeMeasure, msg.sender);
        }

        _typeMeasures[_codeMeasure] = TypeMeasure(
        _description,
        _info,
        _isActive,
        _isAllowed,
        true);
    }    

}