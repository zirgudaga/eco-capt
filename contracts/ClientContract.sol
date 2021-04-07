// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract ClientContract is Ownable {
    using Counters for Counters.Counter;
    
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
    }
    
    // struct mesure en-tête (32) { 
    //   //V0.1     XX.XX.XX    00.01.00
    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3 
    // }
    
    // struct mesure donnée (32) { 
    //   Valeur Max : bytes8
    //   Valeur Moyenne : bytes8
    //   Valeur Médiane : bytes8
    //   Valeur Min : bytes8
    // }

    // struct alert donnée (32) { 
    //   Version : bytes8
    //   IdAlert : bytes4    
    //   Date : YYYYmmddHHii : byte12
    //   Valeur alerte : bytes8
    // }
    
    struct Service {
        bytes8 version;
        bytes8 measureType;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        string description;
        address bridgeAddress;
        address techMasterAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter alertIdCounter;        
    }

    struct AlertConfig {
        bytes8 version;        
        address legislatorAddress;
        uint64 dateOn;
        uint64 dateOff;
        bytes8 codeAlerte;
        bool isActive;
    }
    
    event AlerteSend(uint service_id, bytes32 _alert);        

    Config private _myConfig;
    Service[] private _services;
    mapping(uint => AlertConfig[]) private _serviceAlertConfig;    

    Counters.Counter private _serviceIdCounter;
    Counters.Counter private _alertConfigIdCounter;

    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => bytes32[]) private _serviceAlertes;    

    mapping(uint => bytes6[]) private _serviceMacIOT;
 
    constructor (bytes8 _version, address _customerAddress, address _prevContract, uint64 _prevContractDate) {
        _myConfig = Config(
            _version,
            _prevContractDate,
            0,
            _customerAddress,
            _prevContract,
            address(0)
        );  
    }

    function addService(
        bytes8 _version,  
        string memory _description,
        bytes8 _measureType,          
        bytes1 _timeCode,
        uint8 _nbTime) external{
      
        Counters.Counter memory measureIdCounter;
        Counters.Counter memory alertIdCounter;

        _services.push(Service(
        _version, 
        _measureType,  
        _timeCode,    
        _nbTime,   
        true,                        
        _description, 
        address(0),
        address(0),                
        measureIdCounter,
        alertIdCounter));

        _serviceIdCounter.increment();
    }  
    
    function getService(
        uint _service_id) external view returns(Service memory
    ){   
        return (
            _services[_service_id]            
        );
    }

    function getServices() external view returns(
            Service[] memory
            ){     
        return (_services);
    }

    function addMeasure(
        uint _serviceId,
        bytes32 _measureHeader,
        bytes32 _measurebody) external {
            
        require(_serviceId < _serviceIdCounter.current(), "Service not exist");
        require(_services[_serviceId].isActive, "Service off line"); 
        
        _serviceHeaderMeasures[_serviceId].push(_measureHeader);
        _serviceBodyMeasures[_serviceId].push(_measurebody);
        
        _services[_serviceId].measureIdCounter.increment();
    }

    function addAlert(
        uint _serviceId,
        bytes32 _alerteBody) external {
            
        require(_serviceId < _serviceIdCounter.current(), "Service not exist");
        require(_services[_serviceId].isActive, "Service off line"); 
        
        _serviceAlertes[_serviceId].push(_alerteBody);
        
        _services[_serviceId].alertIdCounter.increment();

        emit AlerteSend(_serviceId, _alerteBody);
    }

    function getAlerts(
        uint _serviceId) external view returns(
            bytes32[] memory){
            
        return (_serviceAlertes[_serviceId]);        
    }
  
    function getMeasures(
        uint _serviceId) external view returns(
            bytes32[] memory,
            bytes32[] memory){
              
        return (_serviceHeaderMeasures[_serviceId], _serviceBodyMeasures[_serviceId]);
    }
    
    function getMeasuresById(
        uint _serviceId,
        uint _measureId) external view returns(
            bytes32,
            bytes32){
              
        return (_serviceHeaderMeasures[_serviceId][_measureId], _serviceBodyMeasures[_serviceId][_measureId]);
    }  

}
