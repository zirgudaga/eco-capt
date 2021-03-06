// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";
import "./IECPToken.sol";
import "./ILedgerContract.sol";

contract CustomerContract is Ownable {
    using Counters for Counters.Counter;
    
    // BMP : Bridge message protocol

    // MeasureHeader (32 bytes) 
    //   version : bytes8
    //   date : YYYYmmddHHii : byte12
    //   measureType : bytes8 - CODE : 4 number/letter for the physical nature - 4 number/letter for the version
    //   timeCode : bytes1 (hourly, daily) Y m d H i
    //   nbTime : bytes3 
    
    // MeasureBody (32 bytes)  
    //   Value 1 Max : bytes8
    //   Value 2 Mean : bytes8
    //   Value 3 Mediane : bytes8
    //   Value 4 Min : bytes8

    // AlertBody (32 bytes) 
    //   version : bytes8
    //   codeAlert : bytes4    
    //   date : YYYYmmddHHii : byte12
    //   valueAlert : bytes8

    /**
    * @dev Structure of Configuration
    * @notice Version and status of activation
    * @notice Link to other contract
    */
    struct Config {
        bytes8 version;
        bool isActive;    
        uint64 prevContractDate;
        uint64 nextContractDate;            
        address _ledgerAddress;
        address _ecpTokenAddress;        
        address customerAddress;
        address prevContract;
        address nextContract;
    }
    
    /**
     * @dev Structure of Service
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

    /**
     * @dev Structure of Rule
     */
    struct Rule {
        bytes8 version;    
        bytes4 codeAlert;
        bytes8 valueAlert;    
        uint16 serviceId;
        bool isActive;     
        uint64 dateOn;
        uint64 dateOff;
        string description;   
        address legislatorAddress;

        Counters.Counter alertIdCounter;         
    }

    /**
     * @dev Structure of Iot
     */
    struct Iot {   
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
    }

    modifier checkLedger(address _address, uint _role) {
        require (_ILedgerContract.rootingApps(_address) == _role, "Ledger check fail");
        _;
    }

    event ContractUpdate(string _message, address _author);      
    event ServiceUpdate(uint _serviceId, string _message, address _author);  
    event ServiceRulesUpdate(uint _serviceId, uint _ruleId, string _message, address _author); 
    event ServiceIotUpdate(uint _serviceId, bytes6 _iotId, string _message, address _author); 
    event MeasureReceive(uint _serviceId, bytes32 _header, bytes32 _body, address _author); 
    event AlertReceive(uint _serviceId, uint _ruleId, bytes32 _alert, address _author);        

    Config public _myConfig;

    mapping(uint => Service) public _services;
    Counters.Counter public _serviceIdCounter;

    mapping(uint => mapping(bytes6 => Iot)) public _serviceIots;

    mapping(uint => Rule) public _serviceRules;
    Counters.Counter public _ruleIdCounter;

    IECPToken private _ECPToken;
    ILedgerContract private _ILedgerContract;

    constructor (bytes8 _version, address _ledgerAddress, address _ecpTokenAddress, address _customerAddress, address _prevContract, uint64 _prevContractDate) {
        _myConfig = Config(
            _version,
            true,
            _prevContractDate,
            0,    
            _ledgerAddress,
            _ecpTokenAddress,                    
            _customerAddress,
            _prevContract,            
            address(0)
        );

        _ECPToken = IECPToken(_ecpTokenAddress);
        _ILedgerContract = ILedgerContract(_ledgerAddress);
    }

    // SERVICE PART

     /**
     * @dev add a Service
     * @param _version bytes8 version of service
     * @param _description string description for the dApps interface
     * @param _measureType bytes8 type of measure for the dApps interface
     * @param _timeCode bytes1 time code for the dApps interface
     * @param _nbTime uint8 number of times for the dApps interface
     */
    function addService(
        bytes8 _version,   
        string memory _description,
        bytes8 _measureType,          
        bytes1 _timeCode,
        uint8 _nbTime) 
        onlyCustomer() isContractActive() external{
      
        Counters.Counter memory measureIdCounter;       
        Counters.Counter memory iotIdCounter;    

        _services[_serviceIdCounter.current()] = Service(
        _version, 
        _measureType,  
        _timeCode,    
        _nbTime,   
        true,                     
        _description, 
        address(0),
        address(0),
        address(0),                     
        measureIdCounter,
        iotIdCounter);

        emit ServiceUpdate(_serviceIdCounter.current(), "New service", msg.sender); 

        _serviceIdCounter.increment();
    }  

    /**
     * @dev toggle a Contract activation or deactivation
     */
    function toggleContract()
        onlyOwner() external {
        emit ContractUpdate("Contract on/off", msg.sender);
        _myConfig.isActive = !_myConfig.isActive;
    }  

    /**
     * @dev toggle a Service activation or deactivation
     * @param _serviceId index of service
     */
    function toggleService(
        uint _serviceId)
        onlyCustomer() external {

        emit ServiceUpdate(_serviceId, "Service on/off", msg.sender);

        _services[_serviceId].isActive = !_services[_serviceId].isActive;
    }

    /**
     * @dev set a TechMasterAddress
     * @param _serviceId index of service 
     * @param _techMasterAddress techMaster's address
     */
    function setTechMasterAddress(
        uint _serviceId,
        address _techMasterAddress)
        isContractActive() isServiceActive(_serviceId) checkLedger(_techMasterAddress, 4) onlyOwner() external {  
        
        _services[_serviceId].techMasterAddress = _techMasterAddress;

        emit ServiceUpdate(_serviceId, "TechMaster Address update", msg.sender);
    }     

    /**
     * @dev set a LegislatorAddress
     * @param _serviceId index of service 
     * @param _legislatorAddress legislator's address
     */
    function setLegislatorAddress(
        uint _serviceId,
        address _legislatorAddress)
        isContractActive() isServiceActive(_serviceId) onlyCustomer() checkLedger(_legislatorAddress, 3) external {  
        
        _services[_serviceId].legislatorAddress = _legislatorAddress;

        emit ServiceUpdate(_serviceId, "Legislator Address update", msg.sender);
    }   

    /**
     * @dev set a BridgeAdress
     * @param _serviceId index of service
     * @param _bridgeAddress bridge's address
     */
    function setBridgeAddress(
        uint _serviceId,
        address _bridgeAddress)
        isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) checkLedger(_bridgeAddress, 5) external {  
        
        _services[_serviceId].bridgeAddress = _bridgeAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }     

    // MEASURE PART

    /**
     * @dev add a Measure
     * @param _serviceId index of service 
     * @param _measureHeader header of the measure
     * @param _measurebody body of the measure
     */
    function addMeasure(
        uint _serviceId,
        bytes32 _measureHeader,
        bytes32 _measurebody) 
        isContractActive() isServiceActive(_serviceId) onlyBridge(_serviceId) external {    

        _ECPToken.transfer(_myConfig._ledgerAddress, 1);

        _services[_serviceId].measureIdCounter.increment();

        emit MeasureReceive(_serviceId, _measureHeader, _measurebody, msg.sender);
    }

    // ALERT CONFIG PART

    /**
     * @dev add a fondation's alert config
     * @param _serviceId index of service 
     * @param _version service's version
     * @param _description alert config description 
     * @param _dateOn alert's starting date
     * @param _dateOff alert's ending date
     * @param _codeAlert alert's code
     * @param _valueAlert alert's value
     */
    function addRule(
        bytes8 _version,   
        uint16 _serviceId,        
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes4 _codeAlert,
        bytes8 _valueAlert)
        isContractActive() isServiceActive(_serviceId) external {

        require (_services[_serviceId].legislatorAddress == msg.sender 
        || _myConfig.customerAddress == msg.sender 
        || owner() ==  msg.sender, "Access denied");

        Counters.Counter memory alertIdCounter;

        _serviceRules[_ruleIdCounter.current()] = Rule(
            _version,  
            _codeAlert,
            _valueAlert,            
            _serviceId,  
            true,
            _dateOn,
            _dateOff,            
            _description,      
            msg.sender,
            alertIdCounter
        );

        emit ServiceRulesUpdate(_serviceId, _ruleIdCounter.current(), "New rule", msg.sender);

        _ruleIdCounter.increment();
    }

    /**
     * @dev toggle an alert config
     * @param _ruleId index of the alert config
     */
    function toggleRule(uint _ruleId) 
        external {

        require ((msg.sender == _serviceRules[_ruleId].legislatorAddress) || (msg.sender == owner()), "Access denied");

        emit ServiceRulesUpdate(_serviceRules[_ruleId].serviceId, _ruleId, "Rules on/off", msg.sender);
        
        _serviceRules[_ruleId].isActive = !_serviceRules[_ruleId].isActive;
    }       

    // ALERTS PART

    /**
     * @dev add an alert
     * @param _serviceId index of service 
     * @param _alertBody alert's body
     */    
    function addAlert(
        uint _serviceId,
        uint _ruleId,
        bytes32 _alertBody) 
        isContractActive() isServiceActive(_serviceId) onlyBridge(_serviceId) external {         

        _ECPToken.transfer(_myConfig._ledgerAddress, 1);

        _serviceRules[_ruleId].alertIdCounter.increment();

        emit AlertReceive(_serviceId, _ruleId, _alertBody, msg.sender);
    }

    // SERVICE IOT

    /**
     * @dev add a sensor to the list
     * @param _serviceId index of service
     * @param _macAddress sensor's mac address
     * @param _description sensor's description
     */      
    // function addIot(
    //     uint _serviceId,
    //     bytes6 _macAddress,
    //     string memory _description) 
    //     isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  

    //     _serviceIots[_serviceId][_macAddress] = Iot(
    //         _description,      
    //         true
    //     );

    //     emit ServiceIotUpdate(_serviceId, _macAddress, "Iot added", msg.sender); 

    //     _services[_serviceId].iotIdCounter.increment();   
    // }

    /**
     * @dev toggle a sensor activation or deactivation
     * @param _serviceId index of service
     * @param _macAddress index of sensor
     */     
    // function toggleIOT(
    //     uint _serviceId,
    //     bytes6 _macAddress) 
    //     isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external { 

    //     emit ServiceIotUpdate(_serviceId, _macAddress, "Iot on/off", msg.sender);

    //     _serviceIots[_serviceId][_macAddress].isActive = !_serviceIots[_serviceId][_macAddress].isActive;
    // }

}
