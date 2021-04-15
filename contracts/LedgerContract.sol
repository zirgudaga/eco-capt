// SPDX-License-Identifier: MIT
pragma solidity 0.8.0;

import "../node_modules/@openzeppelin/contracts/utils/Counters.sol";
import "../node_modules/@openzeppelin/contracts/access/Ownable.sol";

contract LedgerContract is Ownable {
    using Counters for Counters.Counter;

    struct Client {
        uint32 clientId;
        string description;
        bool isActive;
    }

    struct Legistalor {
        uint32 LegislatorId;
        string description;
        uint32 LegislatorAddress : ….
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
        uint32 techMasterAddress;
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



constructor (uint32 _foundationAddress, string _description) {
        _myLedger = Ledger(
            _foundationAddress,
            _description,
        );