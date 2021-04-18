// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LedgerContract is Ownable {
    using Counters for Counters.Counter;

    struct Client {
        uint32 clientId;
        string description;
        address addressClient;

        bool isActive;
    }

    struct Legistalor {
        uint32 LegislatorId;
        string description;
        address LegislatorAddress;
        bool isActive;
    }

    struct AffectationLegislator{
	    uint32 clientId;
        uint32 serviceId;
        uint32 alertConfigId;
        bool isActive;
    }

    struct TechMaster {
        uint32 techMasterId;
        string description;
        address techMasterAddress;
        bool isActive;
    }

    struct AffectationTechmaster{
	    uint32 clientId;
        uint32 serviceId;
        bool isActive;
    }

    struct TypeMesure{
	    uint32 idMesure; 
	    string description;
        string info;
        bool isActive;
	    bool isAllowed;
    }

    struct AffectationMeasure{
   	    uint32 clientId;
        uint32 serviceId;
        bool isActive;
    }

    string public ledgerDescription;

    constructor (string memory _description) {
        ledgerDescription = _description;
    }



}