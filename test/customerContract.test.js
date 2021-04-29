const { expectRevert, expectEvent, BN } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const CustomerContract = artifacts.require('CustomerContract.sol');
const LedgerContract = artifacts.require('LedgerContract.sol');
const ECPToken = artifacts.require('ECPToken.sol');

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

    const _ruleId = '0';

    const _codeAlert = "0x11223344";
    const _valueAlert = "0x1112131415161718";     
    const _alertBody = "0x0102030405060708091011121314151601020304050607080910111213141516";

    let BN0 = new BN(0);
    let BN1 = new BN(1);

    let _tokenAddress = "0x0000000000000000000000000000000000000000";
    let _ledgerAddress = "0x0000000000000000000000000000000000000000";
    let _contractAddress = "0x0000000000000000000000000000000000000000";    

    const token_0 = new BN(0);
    const token_99 = new BN(99);
    const token_100 = new BN(100);

    beforeEach(async function () {

        this.ECPToken = await ECPToken.new({from: owner});
        _tokenAddress = this.ECPToken.address;

        this.LedgerContract = await LedgerContract.new(_tokenAddress, {from: owner});
        _ledgerAddress = this.LedgerContract.address;

        await this.ECPToken.setLedgerAddress(_ledgerAddress);

        this.CustomerContract = await CustomerContract.new(
            _version, 
            _ledgerAddress,
            _tokenAddress,
            customer1,
            prevContrat,
            0,
            {from: owner}
        );

        _contractAddress = this.CustomerContract.address;

        this.LedgerContract.setCustomer(
            "Client Test",
            customer1,
            _contractAddress,         
            1,
            true, 
            {from: owner});
    });

    describe('constructor', function () {
        let bn_0 = new BN(0);

        it('Config struct properly made', async function () { 
            let myConfig = await this.CustomerContract._myConfig();       
            expect(myConfig.version).to.equal(_version);   
            expect(myConfig._ledgerAddress).to.equal(_ledgerAddress);
            expect(myConfig.prevContractDate).to.be.bignumber.equal(bn_0);
            expect(myConfig.nextContractDate).to.be.bignumber.equal(bn_0);
            expect(myConfig.customerAddress).to.equal(customer1);        
            expect(myConfig.prevContract).to.equal(prevContrat);   
            expect(myConfig.nextContract).to.equal(address0);                  
            expect(myConfig.isActive).to.equal(true);      
        });   
    });  

    describe('toogleContract', function () {

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge];
            
        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () {      
                await(expectRevert(this.CustomerContract.toggleContract({from: testAccessAddress[i]}), "Ownable: caller is not the owner"));     
            });
        }

        it('Toggle contract - On to Off', async function () {     
            let receipt = await this.CustomerContract.toggleContract({from: owner});
            expectEvent(receipt, "ContractUpdate", {_message: 'Contract on/off', _author: owner });

            let myConfig = await this.CustomerContract._myConfig();
            expect(myConfig.isActive).to.equal(false);    
        });

        it('Toggle contract - Off to On', async function () {  
            this.CustomerContract.toggleContract({from: owner});
            
            let receipt = await this.CustomerContract.toggleContract({from: owner});
            expectEvent(receipt, "ContractUpdate", {_message: 'Contract on/off', _author: owner });

            let myConfig = await this.CustomerContract._myConfig();
            expect(myConfig.isActive).to.equal(true);    
        });   
    });

    describe('addService', function () {

        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [legislator , techmaster, bridge];

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
            await this.CustomerContract.toggleContract({from: owner});        
            
            await (expectRevert(this.CustomerContract.addService(
                _version,
                _description,
                _measureType,
                _timeCode,
                _nbTime,
                {from: customer1}), "Contract off line"));  
        });

        it('Service added properly', async function () { 

            let nbTimeBN = new BN(_nbTime);

            let serviceCounter = await this.CustomerContract._serviceIdCounter();
            expect(serviceCounter).to.be.bignumber.equal(BN0);

            // On procède à l'ajout d'un service
            let receipt = await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            let myService = await this.CustomerContract._services(0);
            expect(myService.version).to.equal(_version);   
            expect(myService.description).to.equal(_description);
            expect(myService.measureType).to.equal(_measureType);
            expect(myService.timeCode).to.equal(_timeCode);
            expect(myService.nbTime).to.be.bignumber.equal(nbTimeBN);
            expect(myService.isActive).to.equal(true);
            expect(myService.bridgeAddress).to.equal(address0);
            expect(myService.techMasterAddress).to.equal(address0);
            expect(myService.legislatorAddress).to.equal(address0);        
            expect(myService.measureIdCounter._value).to.be.bignumber.equal(BN0);
            expect(myService.iotIdCounter._value).to.be.bignumber.equal(BN0);
            
            serviceCounter = await this.CustomerContract._serviceIdCounter();
            expect(serviceCounter).to.be.bignumber.equal(BN1);

            // On regarde que service1 est enregistré - Sur le tableau des services      

            // L'event est bien envoyé par l'application
            expectEvent(receipt, "ServiceUpdate", { _message:"New service", _author: customer1 });
        });
    });


    describe('toggleService', function () {
    
        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [legislator , techmaster, bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1}); 
                await (expectRevert(this.CustomerContract.toggleService(
                    _serviceId, 
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }        

        it('Toggle service - On to Off', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});

            let receipt = await this.CustomerContract.toggleService(_serviceId, {from: owner});
            expectEvent(receipt, "ServiceUpdate", {_serviceId: _serviceId , _message: 'Service on/off', _author: owner });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.isActive).to.equal(false);    
        });

        it('Toggle service - Off to On', async function () {  
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});

            this.CustomerContract.toggleService(_serviceId, {from: owner});
            
            let receipt = await this.CustomerContract.toggleService(_serviceId, {from: owner});
            expectEvent(receipt, "ServiceUpdate", {_serviceId: _serviceId, _message: 'Service on/off', _author: owner });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.isActive).to.equal(true);    
        });   
    });

    describe('setTechMasterAddress', function () {
        
        let testAccessMessage= ['Client', 'Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [customer1 , legislator , techmaster, bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
                await (expectRevert(this.CustomerContract.setTechMasterAddress(
                    _serviceId, 
                    techmaster,
                    {from: testAccessAddress[i]}), "Ownable: caller is not the owner"));  
            });
        }   

        it('Contract off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.toggleContract({from: owner});  

            await (expectRevert(this.CustomerContract.setTechMasterAddress(
                _serviceId, 
                techmaster,
                {from: owner}), "Contract off line"));  
        });

        it('Service not exist', async function () { 
            await (expectRevert(this.CustomerContract.setTechMasterAddress(
                _serviceId, 
                techmaster,
                {from: owner}), "Service not exist"));  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.setTechMasterAddress(
                _serviceId, 
                techmaster,
                {from: owner}), "Service off line"));  
        });

        it('TechMasterAddress added properly', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            let receipt = await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});

            expectEvent(receipt, "ServiceUpdate", { _serviceId: _serviceId, _message:"TechMaster Address update", _author: owner });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.techMasterAddress).to.equal(techmaster);    
        });
    });

    describe('setLegislatorAddress', function () {
        
        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [legislator , techmaster, bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
                await (expectRevert(this.CustomerContract.setLegislatorAddress(
                    _serviceId, 
                    legislator,
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }   

        it('Contract off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.toggleContract({from: owner});  

            await (expectRevert(this.CustomerContract.setLegislatorAddress(
                _serviceId, 
                legislator,
                {from: owner}), "Contract off line"));  
        });

        it('Service not exist', async function () { 
            await (expectRevert(this.CustomerContract.setLegislatorAddress(
                _serviceId, 
                legislator,
                {from: owner}), "Service not exist"));  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.setLegislatorAddress(
                _serviceId, 
                legislator,
                {from: owner}), "Service off line"));  
        });

        it('LegislatorAddress added properly - Owner', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            let receipt = await this.CustomerContract.setLegislatorAddress(_serviceId, legislator, {from: owner});

            expectEvent(receipt, "ServiceUpdate", { _message:"Legislator Address update", _author: owner });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.legislatorAddress).to.equal(legislator);    
        });

        it('LegislatorAddress added properly - Customer', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            let receipt = await this.CustomerContract.setLegislatorAddress(_serviceId, legislator, {from: customer1});

            expectEvent(receipt, "ServiceUpdate", { _serviceId: _serviceId, _message:"Legislator Address update", _author: customer1 });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.legislatorAddress).to.equal(legislator);    
        });
    });

    describe('setBridgeAddress', function () {
        
        let testAccessMessage= ['Client', 'Legislator', 'Bridge'];
        let testAccessAddress= [customer1 , legislator , bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
                await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
                await (expectRevert(this.CustomerContract.setBridgeAddress(
                    _serviceId, 
                    bridge,
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }   

        it('Contract off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.toggleContract({from: owner});  

            await (expectRevert(this.CustomerContract.setBridgeAddress(
                _serviceId, 
                bridge,
                {from: owner}), "Contract off line"));  
        });

        it('Service not exist', async function () { 
            await (expectRevert(this.CustomerContract.setBridgeAddress(
                _serviceId, 
                bridge,
                {from: owner}), "Service not exist"));  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.setBridgeAddress(
                _serviceId, 
                bridge,
                {from: owner}), "Service off line"));  
        });

        it('BridgeAddress added properly - Owner', async function () {
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            let receipt = await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: owner});

            expectEvent(receipt, "ServiceUpdate", { _message:"Bridge Address update", _author: owner });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.bridgeAddress).to.equal(bridge);
        });

        it('BridgeAddress added properly - TechMaster', async function () {
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            let receipt = await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});

            expectEvent(receipt, "ServiceUpdate", { _serviceId: _serviceId, _message:"Bridge Address update", _author: techmaster });

            let myService = await this.CustomerContract._services(_serviceId);
            expect(myService.bridgeAddress).to.equal(bridge);
        });
    });

    describe('addMeasure', function () {

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster'];
        let testAccessAddress= [customer1 , legislator , techmaster];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
                await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
                await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});

                await (expectRevert(this.CustomerContract.addMeasure(
                    _serviceId,
                    _measureHeader,
                    _measurebody,
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }   

        it('Contract off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});    
            await this.CustomerContract.toggleContract({from: owner});  

            await (expectRevert(this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: owner}), "Contract off line"));  
        });

        it('Service not exist', async function () { 
            await (expectRevert(this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: owner}), "Service not exist"));  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});        
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: owner}), "Service off line"));  
        });

        it('No more ECP token', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});        
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});

            await (expectRevert(this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: bridge}), "ERC20: transfer amount exceeds balance"));  
        });

        it('Measure added properly - Owner', async function () {            
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
            await this.LedgerContract.sendClientToken(customer1, 100, {from: owner});  

            let myService = await this.CustomerContract._services(_serviceId);
            let measureCounter = await myService.measureIdCounter._value;
            expect(measureCounter).to.be.bignumber.equal(BN0);

            let receipt = await this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: owner});

            myService = await this.CustomerContract._services(_serviceId);
            measureCounter = await myService.measureIdCounter._value;
            expect(measureCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "MeasureReceive", { 
                _serviceId: _serviceId,
                _header: _measureHeader, 
                _body: _measurebody, 
                 _author: owner 
            });                            
        });

        it('Measure added properly - Techmaster', async function () {            
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});

            await this.LedgerContract.sendClientToken(customer1, 100, {from: owner});  

            let myService = await this.CustomerContract._services(_serviceId);
            let measureCounter = await myService.measureIdCounter._value;
            expect(measureCounter).to.be.bignumber.equal(BN0);

            let receipt = await this.CustomerContract.addMeasure(
                _serviceId,
                _measureHeader,
                _measurebody,
                {from: bridge}
            );

            myService = await this.CustomerContract._services(_serviceId);
            measureCounter = await myService.measureIdCounter._value;
            expect(measureCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "MeasureReceive", { 
                _serviceId: _serviceId,
                _header: _measureHeader, 
                _body: _measurebody, 
                _author: bridge 
            });                            
        });

    });

    describe('addRule', function () {

        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [legislator , techmaster, bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () {  
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});

                await (expectRevert(this.CustomerContract.addRule(
                    _version,   
                    _serviceId,        
                    "Rule Test",  
                    0,
                    0,
                    _codeAlert,
                    _valueAlert,
                    {from: testAccessAddress[i]}), "Access denied")
                );  
            });
        }

        it('Revert if contract offline', async function () { 
            await this.CustomerContract.toggleContract({from: owner});        
            
            await (expectRevert(this.CustomerContract.addRule(
                _version,   
                _serviceId,        
                "Rule Test",  
                0,
                0,
                _codeAlert,
                _valueAlert,
                {from: customer1}), "Contract off line")
            );  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});        
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.addRule(
                _version,   
                _serviceId,        
                "Rule Test",  
                0,
                0,
                _codeAlert,
                _valueAlert,
                {from: customer1}), "Service off line")
            );  
        });

        it('Rule added properly - Owner', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner}); 

            let ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN0);

            // On procède à l'ajout d'un service
            let receipt = await this.CustomerContract.addRule(
                _version,   
                _serviceId,        
                "Rule Test",  
                0,
                0,
                _codeAlert,
                _valueAlert,
                {from: owner}
            );   

            let myRule = await this.CustomerContract._serviceRules(0);
            expect(myRule.version).to.equal(_version);   
            expect(myRule.serviceId).to.be.bignumber.equal(BN0);            
            expect(myRule.description).to.equal("Rule Test");
            expect(myRule.legislatorAddress).to.equal(owner);   
            expect(myRule.dateOn).to.be.bignumber.equal(BN0);
            expect(myRule.dateOff).to.be.bignumber.equal(BN0);
            expect(myRule.codeAlert).to.equal(_codeAlert);
            expect(myRule.valueAlert).to.equal(_valueAlert);    
            expect(myRule.isActive).to.equal(true);    
            expect(myRule.alertIdCounter._value).to.be.bignumber.equal(BN0);
  
            ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "ServiceRulesUpdate", { _serviceId: _serviceId, _ruleId: '0', _message:"New rule", _author: owner });
        });


        it('Rule added properly - Customer', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner}); 

            let ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN0);

            // On procède à l'ajout d'un service
            let receipt = await this.CustomerContract.addRule(
                _version,   
                _serviceId,        
                "Rule Test",  
                0,
                0,
                _codeAlert,
                _valueAlert,
                {from: customer1}
            );   

            let myRule = await this.CustomerContract._serviceRules(0);
            expect(myRule.version).to.equal(_version);   
            expect(myRule.serviceId).to.be.bignumber.equal(BN0);            
            expect(myRule.description).to.equal("Rule Test");
            expect(myRule.legislatorAddress).to.equal(customer1);   
            expect(myRule.dateOn).to.be.bignumber.equal(BN0);
            expect(myRule.dateOff).to.be.bignumber.equal(BN0);
            expect(myRule.codeAlert).to.equal(_codeAlert);
            expect(myRule.valueAlert).to.equal(_valueAlert);    
            expect(myRule.isActive).to.equal(true);    
            expect(myRule.alertIdCounter._value).to.be.bignumber.equal(BN0);
  
            ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "ServiceRulesUpdate", { _serviceId: _serviceId, _ruleId: '0', _message:"New rule", _author: customer1 });
        });

        it('Rule added properly - Legislator', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner}); 
            await this.CustomerContract.setLegislatorAddress(_serviceId, legislator, {from: owner});

            let ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN0);

            // On procède à l'ajout d'un service
            let receipt = await this.CustomerContract.addRule(
                _version,   
                _serviceId,        
                "Rule Test",  
                0,
                0,
                _codeAlert,
                _valueAlert,
                {from: legislator}
            );   

            let myRule = await this.CustomerContract._serviceRules(0);
            expect(myRule.version).to.equal(_version);   
            expect(myRule.serviceId).to.be.bignumber.equal(BN0);            
            expect(myRule.description).to.equal("Rule Test");
            expect(myRule.legislatorAddress).to.equal(legislator);   
            expect(myRule.dateOn).to.be.bignumber.equal(BN0);
            expect(myRule.dateOff).to.be.bignumber.equal(BN0);
            expect(myRule.codeAlert).to.equal(_codeAlert);
            expect(myRule.valueAlert).to.equal(_valueAlert);    
            expect(myRule.isActive).to.equal(true);    
            expect(myRule.alertIdCounter._value).to.be.bignumber.equal(BN0);
 
            ruleCounter = await this.CustomerContract._ruleIdCounter();
            expect(ruleCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "ServiceRulesUpdate", { _serviceId: _serviceId, _ruleId: '0', _message:"New rule", _author: legislator });
        });

    });


    describe('toggleRule', function () {
    
        let testAccessMessage= ['Legislator', 'TechMaster', 'Bridge'];
        let testAccessAddress= [legislator , techmaster, bridge];

        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner}); 

                await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, 
                    {from: owner});    

                await (expectRevert(this.CustomerContract.toggleRule(
                    _ruleId, 
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }        

        it('Toggle service - On to Off to On - Owner', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});

            let receipt = await this.CustomerContract.toggleRule(_ruleId, {from: owner});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: owner });

            let myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(false);   
            
            receipt = await this.CustomerContract.toggleRule(_ruleId, {from: owner});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: owner });
            
            myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(true);   
        });

        it('Toggle service - On to Off to On - Customer', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: customer1});

            let receipt = await this.CustomerContract.toggleRule(_ruleId, {from: customer1});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: customer1 });

            let myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(false);   
            
            receipt = await this.CustomerContract.toggleRule(_ruleId, {from: customer1});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: customer1 });
            
            myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(true);   
        });

        it('Toggle service - On to Off to On - Legislateor', async function () {     
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.setLegislatorAddress(_serviceId, legislator, {from: customer1}); 
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: legislator});

            let receipt = await this.CustomerContract.toggleRule(_ruleId, {from: legislator});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: legislator });

            let myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(false);   
            
            receipt = await this.CustomerContract.toggleRule(_ruleId, {from: legislator});
            expectEvent(receipt, "ServiceRulesUpdate", {_serviceId: _serviceId , _ruleId: _ruleId, _message: 'Rules on/off', _author: legislator });
            
            myRule = await this.CustomerContract._serviceRules(_ruleId);
            expect(myRule.isActive).to.equal(true);   
        });
 
    });


    describe('addAlert', function () {

        let testAccessMessage= ['Client', 'Legislator', 'TechMaster'];
        let testAccessAddress= [customer1 , legislator , techmaster];
    
        for(let i=0; i<testAccessMessage.length; i++){
            it('Access denied - '+testAccessMessage[i], async function () { 
                await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});
                await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
                await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
                await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});

                await (expectRevert(this.CustomerContract.addAlert(
                    _serviceId,
                    _ruleId,
                    _alertBody,
                    {from: testAccessAddress[i]}), "Access denied"));  
            });
        }   

        it('Contract off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});  
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});  
            await this.CustomerContract.toggleContract({from: owner});  

            await (expectRevert(this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: owner}), "Contract off line"));  
        });

        it('Service not exist', async function () { 
            await (expectRevert(this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: bridge}), "Service not exist"));  
        });

        it('Service off line', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});        
            await this.CustomerContract.toggleService(_serviceId, {from: owner});

            await (expectRevert(this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: bridge}), "Service off line"));  
        });

        it('No more ECP token', async function () { 
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: owner});        
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});  

            await (expectRevert(this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: bridge}), "ERC20: transfer amount exceeds balance"));  
        });

        it('Alert added properly - Owner', async function () {            
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});  

            await this.LedgerContract.sendClientToken(customer1, 100, {from: owner});  

            let balanceOfCustomer = await this.ECPToken.balanceOf(_contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_100);

            let myRules = await this.CustomerContract._serviceRules(_ruleId);
            let alertCounter = await myRules.alertIdCounter._value;
            expect(alertCounter).to.be.bignumber.equal(BN0);

            let receipt = await this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: owner});

            balanceOfCustomer = await this.ECPToken.balanceOf(_contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_99);

            myRules = await this.CustomerContract._serviceRules(_ruleId);
            alertCounter = await myRules.alertIdCounter._value;
            expect(alertCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "AlertReceive", { 
                _serviceId: _serviceId,
                _ruleId: _ruleId,
                _alert: _alertBody, 
                _author: owner 
            });                            
        });

        it('Alert added properly - Bridge', async function () {            
            await this.CustomerContract.addService(_version, _description, _measureType, _timeCode, _nbTime, {from: customer1});
            await this.CustomerContract.setTechMasterAddress(_serviceId, techmaster, {from: owner});
            await this.CustomerContract.setBridgeAddress(_serviceId, bridge, {from: techmaster});
            await this.CustomerContract.addRule(_version, _serviceId, "Rule Test", 0, 0, _codeAlert, _valueAlert, {from: owner});  

            await this.LedgerContract.sendClientToken(customer1, 100, {from: owner});  

            let balanceOfCustomer = await this.ECPToken.balanceOf(_contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_100);

            let myRules = await this.CustomerContract._serviceRules(_ruleId);
            let alertCounter = await myRules.alertIdCounter._value;
            expect(alertCounter).to.be.bignumber.equal(BN0);

            let receipt = await this.CustomerContract.addAlert(
                _serviceId,
                _ruleId,
                _alertBody,
                {from: bridge});

            balanceOfCustomer = await this.ECPToken.balanceOf(_contractAddress);    
            expect(balanceOfCustomer).to.be.bignumber.equal(token_99);

            myRules = await this.CustomerContract._serviceRules(_ruleId);
            alertCounter = await myRules.alertIdCounter._value;
            expect(alertCounter).to.be.bignumber.equal(BN1);

            expectEvent(receipt, "AlertReceive", { 
                _serviceId: _serviceId,
                _ruleId: _ruleId,
                _alert: _alertBody, 
                _author: bridge 
            });                            
        });        


    });

});
    
