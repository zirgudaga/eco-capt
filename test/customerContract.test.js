const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CustomerContract = artifacts.require('CustomerContract');
const LedgerContract = artifacts.require('LedgerContract');

// Faire un addConfig, tester que c'est bien fait avec getConfig
// Faire un constructeur et vérifier que les variables de service sont testées
// On créé un contract, on vérifie que le constructeur s'est bien fait
// On créé le contract, on toogle le contract, vérifier onlyowner, essayer avec le client ca marche pas, verifier que le emit a envoyé, verifier que quand j'ai désactivé le contrat, on ne peut pas ajouter de service 
// Faire un addService -> done le onlyCustomer
// tester le getService -> done
// 

// Contrat de test pour addConfig
contract('CustomerClient', function (accounts) {
    const owner = accounts[0]; 
    const legislator = accounts[1];
    const techmaster = accounts[2];
    const customer1 = accounts[3];      
    const customer2 = accounts[4];
    const other = accounts[5];
    let _ledgerAddress = "0x0000000000000000000000000000000000000000";
    const prevContrat = accounts[6];
    const bridge = accounts[7];

    const address0 = "0x0000000000000000000000000000000000000000";
    const _serviceId = '0';
    const _version = "0x0102030405060708";   
    const _description = "Description de test";
    const _measureType = "0x1112131415161718";            
    const _timeCode = "0x21";
    const _nbTime = "6";   
    const _measureHeader = "0x0102030405060708091011121314151601020304050607080910111213141516";
    const _measurebody = "0x0102030405060708091011121314151601020304050607080910111213141516";

    // Avant chaque test unitaire
    beforeEach(async function () {

        this.LedgerContract = await LedgerContract.new();
        _ledgerAddress = this.LedgerContract.address;

        this.CustomerContract = await CustomerContract.new(
            _version, 
            _ledgerAddress,
            customer1,
            prevContrat,
            0,
            {from: owner}
        );
    });

    // describe('constructor', function () {
    //     let bn_0 = new BN(0);

    //     it('Config struct properly made', async function () { 
    //         let myConfig = await this.CustomerContract._myConfig();       
    //         expect(myConfig.version).to.equal(_version);   
    //         expect(myConfig._ledgerAddress).to.equal(_ledgerAddress);
    //         expect(myConfig.prevContractDate).to.be.bignumber.equal(bn_0);
    //         expect(myConfig.nextContractDate).to.be.bignumber.equal(bn_0);
    //         expect(myConfig.customerAddress).to.equal(customer1);        
    //         expect(myConfig.prevContract).to.equal(prevContrat);   
    //         expect(myConfig.nextContract).to.equal(address0);                  
    //         expect(myConfig.isActive).to.equal(true);      
    //     });   
    // });  

    // describe('toogleContract', function () {

    //     let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge', 'Other'];
    //     let testAccessAddress= [customer1 , legislator , techmaster, bridge , other ];
            
    //     for(let i=0; i<testAccessMessage.length; i++){
    //         it('Access denied - '+testAccessMessage[i], async function () {      
    //             await(expectRevert(this.CustomerContract.toggleContract({from: testAccessAddress[i]}), "Ownable: caller is not the owner"));     
    //         });
    //     }

    //     it('Toggle contract - On to Off', async function () {     
    //         let receipt = await this.CustomerContract.toggleContract({from: owner});
    //         expectEvent(receipt, "ContractUpdate", {_message: 'Contract on/off', _author: owner });

    //         let myConfig = await this.CustomerContract._myConfig();
    //         expect(myConfig.isActive).to.equal(false);    
    //     });

    //     it('Toggle contract - Off to On', async function () {  
    //         this.CustomerContract.toggleContract({from: owner});
            
    //         let receipt = await this.CustomerContract.toggleContract({from: owner});
    //         expectEvent(receipt, "ContractUpdate", {_message: 'Contract on/off', _author: owner });

    //         let myConfig = await this.CustomerContract._myConfig();
    //         expect(myConfig.isActive).to.equal(true);    
    //     });   
    // });

    describe('addService', function () {


        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge', 'Other'];
        let testAccessAddress= [legislator , techmaster, bridge , other ];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () {  
                await (expectRevert(this.CustomerContract.addService(
                    _version,
                    _description,
                    _measureType,
                    _timeCode,
                    _nbTime,
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }

        it('Revert if contract offline', async function () { 
            // On vérifie bien que l'ajout provoque un revert !
            this.CustomerContract.toggleContract({from: owner});        
            
            await (expectRevert(this.CustomerContract.addService(
                _version,
                _description,
                _measureType,
                _timeCode,
                _nbTime,
                {from: customer1}), "Contract off line"));  
        });

        it('Service added properly', async function () { 

            let _nbTimeBN = new BN(_nbTime);
            let _BN0 = new BN(0);

            // On procède à l'ajout d'un service
            let receipt = await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            let myService = await this.CustomerContract._services(0);
            expect(myService.version).to.equal(_version);   
            expect(myService.description).to.equal(_description);
            expect(myService.measureType).to.equal(_measureType);
            expect(myService.timeCode).to.equal(_timeCode);
            expect(myService.nbTime).to.be.bignumber.equal(_nbTimeBN);
            expect(myService.isActive).to.equal(true);
            expect(myService.bridgeAddress).to.equal(address0);
            expect(myService.techMasterAddress).to.equal(address0);
            expect(myService.legislatorAddress).to.equal(address0);        
            expect(myService.measureIdCounter._value).to.be.bignumber.equal(_BN0);
            expect(myService.iotIdCounter._value).to.be.bignumber.equal(_BN0);
            
            // On regarde que service1 est enregistré - Sur le tableau des services      

            // L'event est bien envoyé par l'application
            expectEvent(receipt, "ServiceUpdate", { _message:"New service", _author: customer1 });
        });
    });



    // // Contrat de test pour toggleService
    // descibe('toggleService', function () {

    //     it('Toggle service - On to Off', async function () {     
    //         let receipt = await this.ClientContract.toggleService(_serviceId, {from: owner});
    //         expectEvent(receipt, "ServiceUpdate", {_serviceId: _serviceId , _message: 'Service off', _author: owner });

    //         let myService = await this.ClientContract.getOneService(_serviceId);
    //         expect(myService.isActive).to.equal(false);    
    //     });

    //     it('Toggle service - Off to On', async function () {  
    //         this.ClientContract.toggleService(_serviceId, {from: owner});
            
    //         let receipt = await this.ClientContract.toggleService(_serviceId, {from: owner});
    //         expectEvent(receipt, "ServiceUpdate", {_serviceId: _serviceId, _message: 'Service on', _author: owner });

    //         let myService = await this.ClientContract.getOneService(_serviceId);
    //         expect(myService.isActive).to.equal(true);    
    //     });   
    // });

    // // Contrat de test pour toggleService
    // descibe('addMeasure', function () {
    //     it('Revert if other : onlyBridge', async function () { 
    //         // On vérifie bien que l'ajout provoque un revert !
    //         let receipt = await this.ClientContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: client});
    //         await (expectRevert(this.ClientContract.addMeasure(
    //             _serviceId,
    //             _measureHeader,
    //             _measurebody,
    //             {from: other}), "Access denied"));  
    //     });
    // });


});
    