const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');

const { expect } = require('chai');

const ClientContract = artifacts.require("ClientContract");

contract('addService', function (accounts) {
    const owner = accounts[0];
    const client = accounts[1];
    const other = accounts[2];
    const prevContrat = accounts[3];

    let _version = "0x0102030405060708";   
    let _description = "Description de test";
    let _measureType = "0x1112131415161718";            
    let _timeCode = "0x21";
    let _nbTime = 6; 
    let _prevContractDate = 0;
    
    beforeEach(async function () {
        this.ClientContract = await ClientContract.new(_version, client, prevContrat, _prevContractDate, {from: owner});
    });

    it('Revert if other', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        
        await (expectRevert(this.ClientContract.addService(
            _version,
            _description,
            _measureType,
            _timeCode,
            _nbTime,
            {from: other}), "Access denied"));       
    });

});
