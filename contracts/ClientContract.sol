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
    * @dev Structure of Configuration
    * @notice Version and status of activation
    * @notice Link to other contract
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
    
    /**
     * @dev Structure of Voter
     * @notice Feature_V2 : isAbleToPropose and hasProposed
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

        Counters.Counter alertConfigIdCounter;
        Counters.Counter alertIdCounter; 
        Counters.Counter measureIdCounter;
        Counters.Counter IotIdCounter;     
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

    struct Iot {
        bytes6 mac;     
        string description;
        bool isActive;
    }

    modifier isContractActive() {
        require(_myConfig.isActive, "Contract off line");
        _;
    }

    modifier isServiceActive(uint _serviceId) {
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
    event ContractUpdate(string _message, address _author);      
    event ServiceUpdate(uint _service_id, string _message, address _author); 
    event ServiceElementUpdate(uint _service_id, uint _id, string _message, address _author); 
    
               
    Config private _myConfig;
    Service[] private _services;

    Counters.Counter public _serviceIdCounter;

    mapping(uint => AlertConfig[]) private _serviceAlertConfig;  
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => bytes32[]) private _serviceAlerts;    
    mapping(uint => Iot[]) private _serviceMacIOT;
 
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

    // CONFIG PART
    function getConfig() external view returns (Config memory) {
        return _myConfig;
    }

    function toggleContract()
        onlyOwner() external {
        if(_myConfig.isActive){
            emit ContractUpdate("Contract off", msg.sender);
        }else{
            emit ContractUpdate("Contract on", msg.sender);
        } 
        _myConfig.isActive = !_myConfig.isActive;
    }    

    // SERVICE PART
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
        Counters.Counter memory IotIdCounter;    

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
        alertIdCounter,
        IotIdCounter));

        emit ContractUpdate("New service", msg.sender);

        _serviceIdCounter.increment();
    }  

    function getOneService(
        uint _serviceId) 
        external view returns(Service memory){   

        return (_services[_serviceId]);
    }

    function getAllServices() 
        external view 
        returns(Service[] memory){    

        return (_services);
    }    

    function toggleService(
        uint _serviceId)
        onlyCustomer() external {

        if(_services[_serviceId].isActive){
            emit ServiceUpdate(_serviceId, "Service off", msg.sender);
        }else{
            emit ServiceUpdate(_serviceId, "Service on", msg.sender);
        } 
        _services[_serviceId].isActive = !_services[_serviceId].isActive;
    }

    function setTechMasterAddress(
        uint _serviceId,
        address _techMasterAddress)
        isContractActive() isServiceActive(_serviceId) onlyOwner() external {  
        
        _services[_serviceId].techMasterAddress = _techMasterAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   

    function setBridgeAddress(
        uint _serviceId,
        address _bridgeAddress)
        isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  
        
        _services[_serviceId].bridgeAddress = _bridgeAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   

    function setLegislatorAddress(
        uint _serviceId,
        address _legislatorAddress)
        isContractActive() isServiceActive(_serviceId) onlyCustomer() external {  
        
        _services[_serviceId].legislatorAddress = _legislatorAddress;

        emit ServiceUpdate(_serviceId, "Legislator Address update", msg.sender);
    }   
    
    // MEASURE PART
    function addMeasure(
        uint _serviceId,
        bytes32 _measureHeader,
        bytes32 _measurebody) 
        isContractActive() isServiceActive(_serviceId) onlyBridge(_serviceId) external {    
        
        _serviceHeaderMeasures[_serviceId].push(_measureHeader);
        _serviceBodyMeasures[_serviceId].push(_measurebody);
        
        _services[_serviceId].measureIdCounter.increment();

        emit MeasureReceive(_serviceId, _measureHeader, _measurebody, msg.sender);
    }

    function getAllMeasures(
        uint _serviceId) 
        external view 
        returns(
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

    // ALERT CONFIG PART
    function addAlertConfigCustomer(
        uint _serviceId,
        bytes8 _version, 
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,         
        bytes8 _valueAlert)         
        isContractActive() isServiceActive(_serviceId) onlyCustomer() external{  

            _addAlertConfig(_serviceId, _version, _description, msg.sender, _dateOn, _dateOff, _codeAlert, _valueAlert);
    }

    function addAlertConfigLegislator(
        uint _serviceId,
        bytes8 _version,   
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,         
        bytes8 _valueAlert)         
        isContractActive() isServiceActive(_serviceId) onlyLegislator(_serviceId) external{   

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
        internal {

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

        emit ServiceElementUpdate(_serviceId, _services[_serviceId].alertConfigIdCounter.current(), "New Config Alert", msg.sender);

        _services[_serviceId].alertConfigIdCounter.increment();

    }

    function getAllAlertConfigs(
        uint _serviceId) 
        external view 
        returns(AlertConfig[] memory){
              
        return (_serviceAlertConfig[_serviceId]);
    }

    function toggleAlertConfig(
        uint _serviceId, uint _alertConfigId) 
        external {

        require ((msg.sender == _serviceAlertConfig[_serviceId][_alertConfigId].legislatorAddress) || (msg.sender == owner()));

        if(_serviceAlertConfig[_serviceId][_alertConfigId].isActive){
            emit ServiceElementUpdate(_serviceId, _alertConfigId, "Alert off", msg.sender);
        }else{
            emit ServiceElementUpdate(_serviceId, _alertConfigId, "Alert on", msg.sender);
        } 

        _serviceAlertConfig[_serviceId][_alertConfigId].isActive = !_serviceAlertConfig[_serviceId][_alertConfigId].isActive;
    }       

    // ALERTS PART
    function addAlert(
        uint _serviceId,
        bytes32 _alertBody) 
        isContractActive() isServiceActive(_serviceId) onlyBridge(_serviceId) external {         
                   
        _serviceAlerts[_serviceId].push(_alertBody);
        _services[_serviceId].alertIdCounter.increment();

        emit AlertReceive(_serviceId, _alertBody, msg.sender);
    }

    function getAlerts(
        uint _serviceId) 
        external view 
        returns(bytes32[] memory){
            
        return (_serviceAlerts[_serviceId]);        
    }

    // SERVICE IOT
    function addIot(
        uint _serviceId,
        bytes6 _macAddress,
        string memory _description) 
        isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  
            _serviceMacIOT[_serviceId].push(Iot(
                _macAddress,    
                _description,      
                true
            ));

        emit ServiceElementUpdate(_serviceId, _services[_serviceId].IotIdCounter.current(), "Iot added", msg.sender); 

        _services[_serviceId].IotIdCounter.increment();   
    }

    function getIot(
        uint _serviceId) 
        external view 
        returns(Iot[] memory) {
              
        return (_serviceMacIOT[_serviceId]);
    }
        
    function toggleIOT(
        uint _serviceId,
        uint _iotId) 
        isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  

        if(_serviceMacIOT[_serviceId][_iotId].isActive){
            emit ServiceElementUpdate(_serviceId, _iotId, "Iot off", msg.sender);
        }else{
            emit ServiceElementUpdate(_serviceId, _iotId, "Iot on", msg.sender);
        } 

        _serviceMacIOT[_serviceId][_iotId].isActive = !_serviceMacIOT[_serviceId][_iotId].isActive;
    }

}
