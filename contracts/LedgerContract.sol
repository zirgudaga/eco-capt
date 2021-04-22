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

    struct Bridge {
        string description;
        string url;   
        string info;        
        address techMasterAddress;     
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
    mapping(address => Bridge) public _bridges;
    
    mapping(bytes8 => TypeMeasure) public _typeMeasures;

    function setCustomer (
        string memory _description,
        address _customerAddress, 
        address _contractAddress,
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
        _contractAddress,         
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

    function setBridge (
        string memory _description,
        string memory _url, 
        string memory _info,               
        address _bridgeAddress,
        address _techMasterAddress,       
        bool _isActive) 
        onlyOwner() external {

        if(!_bridges[_bridgeAddress].exist){
            emit LedgerUpdate("New Bridge", _bridgeAddress, msg.sender);
        }else{
            emit LedgerUpdate("Update Bridge", _bridgeAddress, msg.sender);
        }

        _bridges[_bridgeAddress] = Bridge(
        _description,
        _url,        
        _info,
        _techMasterAddress,
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

    function rootingApps()
        external view returns(uint _myTypeUser, address _return){
        /*
            1 : Admin
            2 : Client
            3 : Législateur
            4 : Techmaster
            5 : Public
        */
        if(msg.sender == owner()){
            return (1, msg.sender);
        }
        if(_customers[msg.sender].exist){
            return (2, msg.sender);
        }
        if(_legislators[msg.sender].exist){
            return (3, msg.sender);
        }
        if(_techMasters[msg.sender].exist){
            return (4, msg.sender);
        }
        return (5, msg.sender);
    }

}
