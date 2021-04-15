
// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract Test is Ownable {
    using Counters for Counters.Counter;
    
    
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

    Service[] private _services;
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    Counters.Counter public _serviceIdCounter;
 
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
        external{
      
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

        _serviceIdCounter.increment();
    }  


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

}

