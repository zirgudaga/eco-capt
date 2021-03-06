// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./IECPToken.sol";

contract LedgerContract is Ownable {
    using Counters for Counters.Counter;

    /**
     * @dev Structure of Customer
     */
    struct Customer {
        string description;
        address contractAddress;
        uint siretNumber;
        bool isActive;
        bool exist;
    }

    /**
     * @dev Structure of Legislator 
     */
    struct Legislator {
        string description;
        uint siretNumber;        
        bool isActive;
        bool exist;        
    }

    /**
     * @dev Structure of TechMaster
     */
    struct TechMaster {
        string description;
        uint siretNumber;        
        bool isActive;
        bool exist;        
    }

    /**
     * @dev Structure of Bridge
     */
    struct Bridge {
        string description;
        string url;   
        string info;        
        address techMasterAddress;     
        bool isActive;
        bool exist;        
    }

    /**
     * @dev Structure of TypeMeasure
     */
    struct TypeMeasure{
	    string description;
        string info;
        bool isActive;
	    bool isAllowed;
        bool exist;        
    }

    event LedgerUpdate(string _message, address _target, address _author);  
    event TypeMeasureUpdate(string _message, bytes8 _target, address _author);  
  
    modifier onlyTechMaster() {
        require (_techMasters[msg.sender].exist || owner() ==  msg.sender, "Access denied");
        _;
    }

    mapping(address => Customer) public _customers; 
    mapping(address => Legislator) public _legislators; 
    mapping(address => TechMaster) public _techMasters;
    mapping(address => Bridge) public _bridges;
    mapping(bytes8 => TypeMeasure) public _typeMeasures;

    address public ecpTokenAddress;
    IECPToken private _ECPToken;

    constructor (address _ecpTokenAddress) {
        ecpTokenAddress = _ecpTokenAddress;
        _ECPToken = IECPToken(_ecpTokenAddress);
    }    

     /**
     * @dev set a Customer
     * @param _description string description of a Customer
     * @param _customerAddress address Customer's address
     * @param _contractAddress address contract's address
     * @param _siretNumber uint Customer's siretNumber
     * @param _isActive bool Customer's status : active / inactive
     */
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

     /**
     * @dev set a Legislator
     * @param _description string description of a Legislator
     * @param _legislatorAddress address Legislator's address
     * @param _siretNumber uint Legislator's siretNumber
     * @param _isActive bool Legislator's status : active / inactive
     */
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

     /**
     * @dev set a TechMaster
     * @param _description string description of a TechMaster
     * @param _techMasterAddress address TechMaster's address
     * @param _siretNumber uint TechMaster's siretNumber
     * @param _isActive bool TechMaster's status : active / inactive
     */
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

     /**
     * @dev set a Bridge
     * @param _description string description of a Bridge
     * @param _url string url of a Bridge
     * @param _info string info regarding a Bridge
     * @param _bridgeAddress address Bridge's address
     * @param _techMasterAddress address TechMaster's address
     * @param _isActive bool TechMaster's status : active / inactive
     */
    function setBridge (
        string memory _description,
        string memory _url, 
        string memory _info,               
        address _bridgeAddress,
        address _techMasterAddress,       
        bool _isActive) 
        onlyTechMaster() external {

        if(!_bridges[_bridgeAddress].exist){
            emit LedgerUpdate("New Bridge", _bridgeAddress, msg.sender);
        }else{
            require(_bridges[_bridgeAddress].techMasterAddress == msg.sender || owner()==msg.sender, "Access denied");
            emit LedgerUpdate("Update Bridge", _bridgeAddress, msg.sender);
        }

        if(owner()!=msg.sender){
            _techMasterAddress = msg.sender;
        }

        _bridges[_bridgeAddress] = Bridge(
        _description,
        _url,        
        _info,
        _techMasterAddress,
        _isActive,
        true);
    } 

     /**
     * @dev set a TypeMeasure
     * @param _description string description of a TypeMeasure
     * @param _info string info regarding a TypeMeasure
     * @param _codeMeasure bytes8 TypeMeasure's code
     * @param _isActive bool TechMaster's status : active / inactive 
     * @param _isAllowed bool TypeMeasure's authorization status
     */    
    function setTypeMeasure (
        string memory _description,
        string memory _info,
        bytes8 _codeMeasure,
        bool _isActive,
        bool _isAllowed) 
        onlyOwner() external {  

        if(!_typeMeasures[_codeMeasure].exist){
            emit TypeMeasureUpdate("New TypeMeasure", _codeMeasure, msg.sender);
        }else{
            emit TypeMeasureUpdate("Update TypeMeasure", _codeMeasure, msg.sender);
        }

        _typeMeasures[_codeMeasure] = TypeMeasure(
        _description,
        _info,
        _isActive,
        _isAllowed,
        true);
    }    

     /**
     * @dev allows the dApp to mint ECP if is owner
     * @param _target address of mint recever
     * @param _amount uint user's type 
     */ 
    function mintECP ( 
        address _target,             
        uint _amount) 
        onlyOwner() external {

        _ECPToken.ownerMint (_target, _amount);
    }

     /**
     * @dev allows the dApp to mint ECP if is owner
     * @param _customerAddress address of mint recever
     * @param _amount uint user's type 
     */ 
    function sendClientToken ( 
        address _customerAddress,             
        uint _amount) 
        onlyOwner() external {

        require(_customers[_customerAddress].exist, "Customer not exist"); 

        if(_ECPToken.balanceOf(address(this)) < _amount){
            _ECPToken.ownerMint (_customers[_customerAddress].contractAddress, _amount);
        }else{
            _ECPToken.transfer(_customers[_customerAddress].contractAddress, _amount);
        }
    }

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
            3 : L??gislateur
            4 : Techmaster
            5 : Bridge
            9 : Public
        */

        if(_userAddress==address(0)){
            if(msg.sender == owner()){
                return 1;
            }
            if((_customers[msg.sender].exist) && (_customers[msg.sender].isActive)){
                return 2;
            }
            if((_legislators[msg.sender].exist) && (_legislators[msg.sender].isActive)){
                return 3;
            }
            if((_techMasters[msg.sender].exist) && (_techMasters[msg.sender].isActive)){
                return 4;
            }
            if((_bridges[msg.sender].exist) && (_bridges[msg.sender].isActive)){
                return 5;
            }
        }
        else
        {
           if(_userAddress == owner()){
                return 1;
            }
            if((_customers[_userAddress].exist) && (_customers[_userAddress].isActive)){
                return 2;
            }
            if((_legislators[_userAddress].exist) && (_legislators[_userAddress].isActive)){
                return 3;
            }
            if((_techMasters[_userAddress].exist) && (_techMasters[_userAddress].isActive)){
                return 4;
            }
            if((_bridges[_userAddress].exist) && (_bridges[_userAddress].isActive)){
                return 5;
            }
        }

        return 9;
    }
}
