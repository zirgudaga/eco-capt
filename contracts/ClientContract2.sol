// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ClientContract2 is Ownable {
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
    //   CodeAlert : bytes4    
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
        uint32 clientId;
        uint64 prevContractDate;
        uint64 nextContractDate;
        address customerAddress;
        address prevContract;
        address nextContract;
        bool isActive;
    }
    
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
        bool isAllowed;
        string description;
        address bridgeAddress;
        address techMasterAddress;
        address legislatorAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter IotIdCounter;     
    }

    /**
     * @dev Structure of AlertConfig
     * @notice Feature_V2 
     */
    struct AlertConfig {
        bytes8 version;        
        uint16 serviceId;
        string description;   
        address legislatorAddress;
        uint64 dateOn;
        uint64 dateOff;
        bytes8 codeAlert;
        bytes8 valueAlert;
        bool isActive;

        Counters.Counter alertConfigIdCounter;
        Counters.Counter alertIdCounter;         
    }

    /**
     * @dev Structure of Iot
     * @notice Feature_V2 
     */
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
        require(_services[_serviceId].isAllowed, "Service not allowed"); 
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

    event MeasureReceive(uint _serviceId, bytes32 _header, bytes32 _body, address _author); 
    event AlertReceive(uint _serviceId, uint _alertConfigId, bytes32 _alert, address _author); 
    event ContractUpdate(string _message, address _author);      
    event ServiceUpdate(uint _serviceId, string _message, address _author); 
    event ServiceElementUpdate(uint _serviceId, uint _id, string _message, address _author); 
               
    Config private _myConfig;

    Service[] private _services;
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => Iot[]) private _serviceMacIOT;
    Counters.Counter public _serviceIdCounter;

    AlertConfig[] private _serviceAlertConfig;
    mapping(uint => bytes32[]) private _alerts; 
    Counters.Counter public _alertConfigIdCounter;
 
    constructor (bytes8 _version, uint32 _clientId, address _customerAddress, address _prevContract, uint64 _prevContractDate) {
        _myConfig = Config(
            _version,
            _clientId,
            _prevContractDate,
            0,
            _customerAddress,
            _prevContract,
            address(0),
            true
        );
        // TODO AJOUTER INSTANCE DU GRAND REGISTRE POUR POUVOIR Y ACCEDER SI NECESSAIRE
    }

    // CONFIG PART
    
    /**
     * @dev get a Config
     * @return config in memory
     */
    function getConfig() external view returns (Config memory) {
        return _myConfig;
    }

    /**
     * @dev toggle a Contract activation or deactivation
     */
    function toggleContract()
        onlyOwner() external {
        emit ContractUpdate("Contract on/off", msg.sender);
        _myConfig.isActive = !_myConfig.isActive;
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
        Counters.Counter memory IotIdCounter;    

        _services.push(Service(
        _version, 
        _measureType,  
        _timeCode,    
        _nbTime,   
        true,  
        true,                      
        _description, 
        address(0),
        address(0),
        address(0),                     
        measureIdCounter,
        IotIdCounter));

        emit ContractUpdate("New service", msg.sender);

        _serviceIdCounter.increment();
    }  

    /*
    function _checkValidService(bytes8 _version, bytes8 _measureType, bytes1 _timeCode, uint8 _nbTime) 
        internal pure returns(bool _return){
        // TODO LINK AU GRAND REGISTRE
        // Eviter l'usage de type service désactivé car n'étant plus pertinent
        return true;       
    }
    */

    /**
     * @dev get a specific Service
     * @param _serviceId index of service
     * @return a specific service
     */
    function getOneService(
        uint _serviceId) 
        external view returns(Service memory){   

        return (_services[_serviceId]);
    }

    /**
     * @dev get all Services
     * @return an array of all the services
     */
    function getAllServices() 
        external view 
        returns(Service[] memory){    

        return (_services);
    }    

    /**
     * @dev toggle a Service activation or deactivation
     * @param _serviceId index of service
     */
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

    /**
     * @dev toggle a Service allowed or desallowed
     * @param _serviceId index of service
     */
    function toggleAllowed(
        uint _serviceId)
        onlyOwner() external {

        if(_services[_serviceId].isAllowed){
            emit ServiceUpdate(_serviceId, "Service desallowed", msg.sender);
        }else{
            emit ServiceUpdate(_serviceId, "Service allowed", msg.sender);
        } 
        _services[_serviceId].isAllowed = !_services[_serviceId].isAllowed;
    }

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

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }     

    /**
     * @dev set a BridgeAdress
     * @param _serviceId index of service
     * @param _bridgeAddress bridge's address
     */
    function setBridgeAddress(
        uint _serviceId,
        address _bridgeAddress)
        isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  
        
        _services[_serviceId].bridgeAddress = _bridgeAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }   

    /**
     * @dev set a LegislatorAddress
     * @param _serviceId index of service 
     * @param _legislatorAddress legislator's address
     */
    function setLegislatorAddress(
        uint _serviceId,
        address _legislatorAddress)
        isContractActive() isServiceActive(_serviceId) onlyCustomer() external {  
        
        require(_checkValidLegislator(_legislatorAddress) == true, "Legistator not valid");

        _services[_serviceId].legislatorAddress = _legislatorAddress;

        emit ServiceUpdate(_serviceId, "Legislator Address update", msg.sender);
    }     

    function _checkValidLegislator(
        address _address) 
        internal view 
        returns(bool _return){

        if(_address != msg.sender)
            return true;
        // TODO LINK AU GRAND REGISTRE
        return true;       
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
        
        _serviceHeaderMeasures[_serviceId].push(_measureHeader);
        _serviceBodyMeasures[_serviceId].push(_measurebody);
        
        _services[_serviceId].measureIdCounter.increment();

        emit MeasureReceive(_serviceId, _measureHeader, _measurebody, msg.sender);
    }

    /**
     * @dev get all Measures
     * @param _serviceId index of service 
     * @return an array of all the services
     */
    function getAllMeasures(
        uint _serviceId) 
        external view 
        returns(
            bytes32[] memory,
            bytes32[] memory){
              
        return (_serviceHeaderMeasures[_serviceId], _serviceBodyMeasures[_serviceId]);
    }

    /**
     * @dev get a specific measure by id
     * @param _serviceId index of service 
     * @param _measureId index of service 
     * @return the specific measure header and body
     */    
    function getMeasuresById(
        uint _serviceId,
        uint _measureId) 
        external view returns(
            bytes32,
            bytes32){
              
        return (_serviceHeaderMeasures[_serviceId][_measureId], _serviceBodyMeasures[_serviceId][_measureId]);
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
    function addAlertConfig(
        bytes8 _version,   
        uint16 _serviceId,        
        string memory _description,  
        uint64 _dateOn,
        uint64 _dateOff,
        bytes8 _codeAlert,
        bytes8 _valueAlert)
        external {

        address _legislatorAddress = msg.sender;

        // TODO Penser à fermer la porte !!
        // TODO Penser a vérifier que le service existe
        
        Counters.Counter memory alertConfigIdCounter;
        Counters.Counter memory alertIdCounter;

        _serviceAlertConfig.push(AlertConfig(
            _version,  
            _serviceId,  
            _description,      
            _legislatorAddress,
            _dateOn,
            _dateOff,
            _codeAlert,
            _valueAlert,
            true,
            alertConfigIdCounter,
            alertIdCounter
        ));

        emit ServiceElementUpdate(_serviceId, _alertConfigIdCounter.current(), "New Config Alert", msg.sender);

        _alertConfigIdCounter.increment();
    }

    /**
     * @dev get all alert configs
     */
    function getAllAlertConfigs() 
        external view 
        returns(AlertConfig[] memory){
              
        return (_serviceAlertConfig);
    }

    /**
     * @dev toggle an alert config
     * @param _alertConfigId index of the alert config
     */
    function toggleAlertConfig(uint _alertConfigId) 
        external {

        require ((msg.sender == _serviceAlertConfig[_alertConfigId].legislatorAddress) || (msg.sender == owner()));

        uint _serviceId = _serviceAlertConfig[_alertConfigId].serviceId;

        emit ServiceElementUpdate(_serviceId, _alertConfigId, "Alert on/off", msg.sender);

        _serviceAlertConfig[_alertConfigId].isActive = !_serviceAlertConfig[_alertConfigId].isActive;
    }       

    // ALERTS PART

    /**
     * @dev add an alert
     * @param _serviceId index of service 
     * @param _alertBody alert's body
     */    
    function addAlert(
        uint _serviceId,
        uint _alertConfigId,
        bytes32 _alertBody) 
        isContractActive() isServiceActive(_serviceId) onlyBridge(_serviceId) external {         
                   
        _alerts[_alertConfigId].push(_alertBody);
        _serviceAlertConfig[_alertConfigId].alertIdCounter.increment();

        emit AlertReceive(_serviceId, _alertConfigId, _alertBody, msg.sender);
    }

    /**
     * @dev get all alerts of a specific alerteConfig
     * @param _alertConfigId index of alerteConfig 
     */  
    function getAlerts(
        uint _alertConfigId) 
        external view 
        returns(bytes32[] memory){
            
        return (_alerts[_alertConfigId]);        
    }

    // SERVICE IOT

    // /**
    //  * @dev add a sensor to the list
    //  * @param _serviceId index of service
    //  * @param _macAddress sensor's mac address
    //  * @param _description sensor's description
    //  */      
    // function addIot(
    //     uint _serviceId,
    //     bytes6 _macAddress,
    //     string memory _description) 
    //     isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  
    //         _serviceMacIOT[_serviceId].push(Iot(
    //             _macAddress,    
    //             _description,      
    //             true
    //         ));

    //     emit ServiceElementUpdate(_serviceId, _services[_serviceId].IotIdCounter.current(), "Iot added", msg.sender); 

    //     _services[_serviceId].IotIdCounter.increment();   
    // }

    // // /**
    // //  * @dev get a specific sensor
    // //  * @param _serviceId index of service
    // //  * @return get a specific sensor by Id
    // //  */ 
    // // function getIot(
    // //     uint _serviceId) 
    // //     external view 
    //     returns(Iot[] memory) {
              
    //     return (_serviceMacIOT[_serviceId]);
    // }

    // /**
    //  * @dev toggle a sensor activation or deactivation
    //  * @param _serviceId index of service
    //  * @param _iotId index of sensor
    //  */     
    // function toggleIOT(
    //     uint _serviceId,
    //     uint _iotId) 
    //     isContractActive() isServiceActive(_serviceId) onlyTechMaster(_serviceId) external {  
    //     emit ServiceElementUpdate(_serviceId, _iotId, "Iot on/off", msg.sender);

    //     _serviceMacIOT[_serviceId][_iotId].isActive = !_serviceMacIOT[_serviceId][_iotId].isActive;
    // }

}
