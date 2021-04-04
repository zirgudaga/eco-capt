// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
pragma experimental ABIEncoderV2;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";

contract ClientContract {
    using Counters for Counters.Counter;
    
    /**
    * @dev Contract Configuration
    */
    struct Config {
        address ownerAdress;
        address customerAddress;
        address prevContract;
        address nextContract;
        bytes8 version;
        uint64 datePrevContract;
        uint64 nextPrevContract;
    }
    
    // struct mesure en-tête (32) { 
    //   //V0.1
    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12
    //   Type de mesureID : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Type temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3
    // }
    
    // struct mesure donnée (32) { 
    //   Valeur Max : bytes8
    //   Valeur Moyenne : bytes8
    //   Valeur Médiane : bytes8
    //   Valeur Min : bytes8
    // }
    
    struct Service {
        bytes8 version;
        string description;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        Counters.Counter measureIdCounter;
    }
    
    Service[] private _services;
    Counters.Counter private _serviceIdCounter;
    mapping(uint => bytes32[]) public _serviceHeaderMeasures;
    mapping(uint => bytes32[]) public _serviceBodyMeasures;
    
    constructor () {
        //TO CONFIG
    }

    function initTestSet() external{
        require(_serviceIdCounter.current() == 0, "Already initialized !");

        this.addService(0x0001020304050607, "Service par default", 0x00, 1);
        this.addMeasure(_serviceIdCounter.current()-1, 0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F, 0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F);
        this.addMeasure(_serviceIdCounter.current()-1, 0x010102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F, 0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F);
        this.addMeasure(_serviceIdCounter.current()-1, 0x020102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F, 0x000102030405060708090A0B0C0D0E0F101112131415161718191A1B1C1D1E1F);
    }

    function addService(
        bytes8 _version,  
        string memory _description,
        bytes1 _timeCode,
        uint8 _nbTime) external{
        
        Counters.Counter memory measureIdCounter;
        
        _services.push(Service(
        _version, 
        _description, 
        _timeCode, 
        _nbTime,
        true,
        measureIdCounter));
        
        _serviceIdCounter.increment();
    }  
    
    function getService(
        uint _service_id) external view returns(
            bytes8 version, 
            string memory description, 
            bytes1 timeCode, 
            uint8 nbTime,
            bool isActive,
            uint256 measureIdCounter){
            
        return (
            _services[_service_id].version,
            _services[_service_id].description,
            _services[_service_id].timeCode,
            _services[_service_id].nbTime,
            _services[_service_id].isActive,
            _services[_service_id].measureIdCounter.current()                 
        );
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
