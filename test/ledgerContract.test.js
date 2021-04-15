const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ClientContract = artifacts.require('ClientContract');
const LedgerContract = artifacts.require('LedgerContract');


contract('constructor', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const _contractAddress = accounts[2];
    const _techMasterAddress = accounts[3];
    const _legislatorAddress = accounts[4];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(_contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

    it('Revert if other : onlyOwner', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await (expectRevert(this.LedgerContract.addContract(
            _foundationAddress,
            _description,
            {from: other}), "Access denied"));  
    });

});

contract('getAllContract', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getOneContract', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Contract added properly', async function () { 

        // On procède à l'ajout d'un service
        let receipt = await this.LedgerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: client});
        let myService = await this.LedgerContract.getOneService(0, {from: client});
        expect(myService.version).to.equal(_version);   
        expect(myService.description).to.equal(_description);
        expect(myService.measureType).to.equal(_measureType);
        expect(myService.timeCode).to.equal(_timeCode);
        expect(myService.nbTime).to.equal(_nbTime);
        expect(myService.isActive).to.equal(true);
        expect(myService.bridgeAddress).to.equal(address0);
        expect(myService.techMasterAddress).to.equal(address0);
        expect(myService.legislatorAddress).to.equal(address0);   
    });     

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getAllLegislator', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getOneLegislator', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('addAffectationLegislator', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getAllTechMaster', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getOneTechMaster', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('addAffectationTech', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getAllTypeMesure', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('getOneTypeMesure', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});

contract('addAffectationMesure', function (accounts) {

    const _foundationAddress = accounts[0];    
    const other = accounts[1];    
    const contractAddress = accounts[2];
    const bridgeAddress = accounts[3];
    const techMasterAddress = accounts[4];
    const legislatorAddress = accounts[5];
    const address0 = "0x0000000000000000000000000000000000000000";

 
    let _description = "Description de la fondation";


    // Avant chaque test unitaire
    beforeEach(async function () {
        this.LedgerContract = await LedgerContract.new(_foundationAddress, _description, {from: owner});
    });

    it('Ledger struct properly made', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myLedger = await this.LedgerContract.getContract(contractAddress);       
        expect(myLedger.foundationAddress).to.equal(_foundationAddress);   
        expect(myLedger.description).to.equal(_description);     
    });   

});