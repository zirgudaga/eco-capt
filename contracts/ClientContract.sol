// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ClientContract is Ownable {
    using Counters for Counters.Counter;
    
    // struct mesure en-tête (32) { 
    //   //V0.1     XX.XX.XX    00.01.00
    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3 
    // }
    
    // struct mesure donnée (32) { 
    //   Valeur 1 Max : bytes8
    //   Valeur 2 Moyenne : bytes8
    //   Valeur 3 Médiane : bytes8
    //   Valeur 4 Min : bytes8
    // }

    // struct alert donnée (32) { 
    //   Version : bytes8
    //   IdAlert : bytes4    
    //   Date : YYYYmmddHHii : byte12
    //   Valeur alert : bytes8
    // }

    /**
    * @dev Contract Configuration
    */
    struct Config {
        bytes8 version;
        uint64 prevContractDate;
        uint64 nextContractDate;
        address customerAddress;
        address prevContract;
        address nextContract;
        bool isActive;
    }
    
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

        Counters.Counter alertConfigIdCounter;
        Counters.Counter alertIdCounter; 
        Counters.Counter measureIdCounter;
    }

    struct AlertConfig {
        bytes8 version;     
        string description;   
        address legislatorAddress;
        uint64 dateOn;
        uint64 dateOff;
        bytes8 codeAlert;
        bytes8 valueAlert;
        bool isActive;
    }

    modifier isContractActive() {
        require(_myConfig.isActive, "Service off line");
        _;
    }

    modifier isServiceOn(uint _serviceId) {
        require(_serviceId < _serviceIdCounter.current(), "Service not exist"); 
        require(_services[_serviceId].isActive, "Service off line"); 
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
    }

    event MeasureReceive(uint _service_id, bytes32 _header, bytes32 _body, address _author); 
    event AlertReceive(uint _service_id, bytes32 _alert, address _author); 
    event ServiceUpdate(uint _service_id, string message, address _author); 
    event ContractUpdate(string message, address _author);  
               
    Config private _myConfig;
    Service[] private _services;

    Counters.Counter private _serviceIdCounter;

    mapping(uint => AlertConfig[]) private _serviceAlertConfig;  
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => bytes32[]) private _serviceAlerts;    
    mapping(uint => bytes6[]) private _serviceMacIOT;
 
    constructor (bytes8 _version, address _customerAddress, address _prevContract, uint64 _prevContractDate) {
        _myConfig = Config(
            _version,
            _prevContractDate,
            0,
            _customerAddress,
            _prevContract,
            address(0),
            true
        );  
    }

    function addService(
        bytes8 _version,   
        string memory _description,
        bytes8 _measureType,          
        bytes1 _timeCode,
        uint8 _nbTime) 
        onlyCustomer() isContractActive() external{
      
        Counters.Counter memory alertConfigIdCounter;
        Counters.Counter memory alertIdCounter;
        Counters.Counter memory measureIdCounter;       

        _services.push(Service(
        _version, 
        _measureType,  
        _timeCode,    
        _nbTime,   
        true,                        
        _description, 
        address(0),
        address(0),  
        address(0),
        alertConfigIdCounter,                       
        measureIdCounter,
        alertIdCounter));

        emit ContractUpdate("New service", msg.sender);

        _serviceIdCounter.increment();
    }  

    function toogleContract()
        onlyOwner external {
        if(_myConfig.isActive){
            emit ContractUpdate("Contract off", msg.sender);
        }else{
            emit ContractUpdate("Contract on", msg.sender);
        } 
        _myConfig.isActive = !_myConfig.isActive;
    }

    function toogleService(uint _serviceId)
        onlyCustomer() external {
        if(_services[_serviceId].isActive){
            emit ServiceUpdate(_serviceId, "Service off", msg.sender);
        }else{
            emit ServiceUpdate(_serviceId, "Service on", msg.sender);
        } 
        _services[_serviceId].isActive = !_services[_serviceId].isActive;
    }

    // function toogleAlertConfig(uint _serviceId, uint _alertConfigId)
    //     onlyCustomer() external {
    //     if(_serviceAlertConfig[_serviceId][_alertConfigId].isActive){
    //         emit ServiceUpdate(_serviceId, "Alert off", msg.sender);
    //     }else{
    //         emit ServiceUpdate(_serviceId, "Alert on", msg.sender);
    //     } 
    //     _serviceAlertConfig[_serviceId][_alertConfigId].isActive = !_serviceAlertConfig[_serviceId][_alertConfigId].isActive;
    // }        

    function setTechMasterAddress(
        uint _serviceId,
        address _techMasterAddress)
        isContractActive() isServiceOn(_serviceId) onlyOwner external {  
        
        _services[_serviceId].techMasterAddress = _techMasterAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   

    function setBridgeAddress(
        uint _serviceId,
        address _bridgeAddress)
        isContractActive() isServiceOn(_serviceId) onlyTechMaster(_serviceId) external {  
        
        _services[_serviceId].bridgeAddress = _bridgeAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   

    function setLegislatorAddress(
        uint _serviceId,
        address _legislatorAddress)
        isContractActive() isServiceOn(_serviceId) onlyCustomer() external {  
        
        _services[_serviceId].legislatorAddress = _legislatorAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   
    
    function getOneService(
        uint _serviceId) 
        external view returns(Service memory){   

        return (
            _services[_serviceId]            
        );
    }

    function getAllServices() 
        external view returns(
        Service[] memory){    

        return (_services);
    }

    function addMeasure(
        uint _serviceId,
        bytes32 _measureHeader,
        bytes32 _measurebody) 
        isContractActive() isServiceOn(_serviceId) onlyBridge(_serviceId) external {    
        
        _serviceHeaderMeasures[_serviceId].push(_measureHeader);
        _serviceBodyMeasures[_serviceId].push(_measurebody);
        
        _services[_serviceId].measureIdCounter.increment();

        emit MeasureReceive(_serviceId, _measureHeader, _measurebody, msg.sender);
    }

    function getAllMeasures(
        uint _serviceId) 
        external view returns(
            bytes32[] memory,
            bytes32[] memory){
              
        return (_serviceHeaderMeasures[_serviceId], _serviceBodyMeasures[_serviceId]);
    }
    
    function getMeasuresById(
        uint _serviceId,
        uint _measureId) 
        external view returns(
            bytes32,
            bytes32){
              
        return (_serviceHeaderMeasures[_serviceId][_measureId], _serviceBodyMeasures[_serviceId][_measureId]);
    }  

    function addAlertConfigCustomer(
        uint _serviceId,
        bytes8 _version, 
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,         
        bytes8 _valueAlert)         
        isContractActive() isServiceOn(_serviceId) onlyCustomer() external{       
            _addAlertConfig(_serviceId, _version, _description, address(0), _dateOn, _dateOff, _codeAlert, _valueAlert);
    }

    function addAlertConfigLegislator(
        uint _serviceId,
        bytes8 _version,   
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,         
        bytes8 _valueAlert)         
        isContractActive() isServiceOn(_serviceId) onlyLegislator(_serviceId) external{       
            _addAlertConfig(_serviceId, _version, _description, msg.sender, _dateOn, _dateOff, _codeAlert, _valueAlert);
    }

    function _addAlertConfig(
        uint _serviceId,
        bytes8 _version,   
        string memory _description,  
        address _legislatorAddress,
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,
        bytes8 _valueAlert)
        internal{

        _serviceAlertConfig[_serviceId].push(AlertConfig(
            _version,    
            _description,      
            _legislatorAddress,
            _dateOn,
            _dateOff,
            _codeAlert,
            _valueAlert,
            true
        ));

        _services[_serviceId].alertConfigIdCounter.increment();

        emit ServiceUpdate(_serviceId, "New Config Alert", msg.sender);
    }

    function getAllAlertConfigs(
        uint _serviceId) 
        external view returns(AlertConfig[] memory){
              
        return (_serviceAlertConfig[_serviceId]);
    }

    function addAlert(
        uint _serviceId,
        bytes32 _alertBody) 
        isContractActive() isServiceOn(_serviceId) onlyBridge(_serviceId) external {         
                   
        _serviceAlerts[_serviceId].push(_alertBody);
        
        _services[_serviceId].alertIdCounter.increment();

        emit AlertReceive(_serviceId, _alertBody, msg.sender);
    }

    function getAlerts(
        uint _serviceId) external view returns(
            bytes32[] memory){
            
        return (_serviceAlerts[_serviceId]);        
    }

}
