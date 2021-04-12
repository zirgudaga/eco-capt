const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const ClientContract = artifacts.require('ClientContract');

  
//TO DO

// Faire un addConfig, tester que c'est bien fait avec getConfig
// Faire un constructeur et vérifier que les variables de service sont testées
// On créé un contract, on vérifie que le constructeur s'est bien fait
// On créé le contract, on toogle le contract, vérifier onlyowner, essayer avec le client ca marche pas, verifier que le emit a envoyé, verifier que quand j'ai désactivé le contrat, on ne peut pas ajouter de service 
// Faire un addService -> done le onlyCustomer
// tester le getService -> done
// 

// Contrat de test pour addConfig
contract('constructor', function (accounts) {
    const owner = accounts[0];    
    const client = accounts[1];
    const other = accounts[2];    
    const prevContrat = accounts[3];
    const bridgeAddress = accounts[4];
    const techMasterAddress = accounts[5];
    const legislatorAddress = accounts[6];
    const address0 = "0x0000000000000000000000000000000000000000";

    let _version = "0x0102030405060708";   
    let _description = "Description de test";
    let _measureType = "0x1112131415161718";            
    let _timeCode = "0x21";
    let _nbTime = "6"; 
    let _prevContractDate = "0";

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.ClientContract = await ClientContract.new(_version, client, prevContrat, _prevContractDate, {from: owner});
    });

    it('Config struct correcty maked', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        let myConfig = await this.ClientContract.getConfig(0);       
        expect(myConfig.version).to.equal(_version);   
        expect(myConfig.prevContractDate).to.equal(_prevContractDate);
        expect(myConfig.nextContractDate).to.equal("0");
        expect(myConfig.customerAddress).to.equal(client);
        expect(myConfig.prevContract).to.equal(prevContrat);        
        expect(myConfig.nextContract).to.equal(address0);      
        expect(myConfig.isActive).to.equal(true);      
    });     
});

// Contrat de test pour addService
contract('toogleContract', function (accounts) {

});

// Contrat de test pour addService
contract('addService', function (accounts) {
    const owner = accounts[0];    
    const client = accounts[1];
    const other = accounts[2];    
    const prevContrat = accounts[3];
    const bridgeAddress = accounts[4];
    const techMasterAddress = accounts[5];
    const legislatorAddress = accounts[6];
    const address0 = "0x0000000000000000000000000000000000000000";

    let _version = "0x0102030405060708";   
    let _description = "Description de test";
    let _measureType = "0x1112131415161718";            
    let _timeCode = "0x21";
    let _nbTime = "6"; 
    let _prevContractDate = "0";

    async function contractToggleItOff(){
        this.ClientContract.toogleContract({from: owner});
    }   

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.ClientContract = await ClientContract.new(_version, client, prevContrat, _prevContractDate, {from: owner});
    });

    it('Revert if other : onlyCustomer', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        
        await (expectRevert(this.ClientContract.addService(
            _version,
            _description,
            _measureType,
            _timeCode,
            _nbTime,
            {from: other}), "Access denied"));  
    });

    it('Revert if contract offline', async function () { 
        // On vérifie bien que l'ajout provoque un revert !
        await contractToggleItOff();
        
        await (expectRevert(this.ClientContract.addService(
            _version,
            _description,
            _measureType,
            _timeCode,
            _nbTime,
            {from: client}), "Contract off line"));  
    });

    it('Service added properly', async function () { 

        // On procède à l'ajout d'un service
        let receipt = await this.ClientContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: client});
        let myService = await this.ClientContract.getOneService(0, {from: client});
        expect(myService.version).to.equal(_version);   
        expect(myService.description).to.equal(_description);
        expect(myService.measureType).to.equal(_measureType);
        expect(myService.timeCode).to.equal(_timeCode);
        expect(myService.nbTime).to.equal(_nbTime);

        // On regarde que service1 est enregistré - Sur le tableau des services      

        // L'event est bien envoyé par l'application
        expectEvent(receipt, "ContractUpdate", { _author: client });
    });
  
});


// Contrat de test pour addService
contract('??????', function (accounts) {
    const owner = accounts[0];    
    const client = accounts[1];
    const other = accounts[2];    
    const prevContrat = accounts[3];
    const bridgeAddress = accounts[4];
    const techMasterAddress = accounts[5];
    const legislatorAddress = accounts[6];
    const address0 = "0x0000000000000000000000000000000000000000";

    let _version = "0x0102030405060708";   
    let _description = "Description de test";
    let _measureType = "0x1112131415161718";            
    let _timeCode = "0x21";
    let _nbTime = "6"; 
    let _prevContractDate = "0";

    // Avant chaque test unitaire
    beforeEach(async function () {
        this.ClientContract = await ClientContract.new(_version, client, prevContrat, _prevContractDate, {from: owner});
    });

});
    
