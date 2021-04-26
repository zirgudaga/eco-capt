# tests_explication.md 

*This file aims at explaining tests and why we wrote them.*

📌 Tests for the  **CustomerContract.sol** were writen while deploying.
We then decided to switch our approach, build our testing structure first and write the **ledgerContrat.sol** as a result.
The goal is to test every key function of each smart contract in order to verify and check if it works properly. 


Regarding the **CustomerContract.sol** contract for instance, the **addService** function needs to be tested during our security check. We need to be sure that only the Customer and ourselves can access the function, and block everyone else attempting to call this paramount set function.

    function addService(
        bytes8 _version,   
        string memory _description,
        bytes8 _measureType,          
        bytes1 _timeCode,
        uint8 _nbTime) 
        onlyCustomer() isContractActive() external{
        
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

        emit ContractUpdate("New service", msg.sender);

        _serviceIdCounter.increment();
    }  

We test the access to this function through **modifiers** located in **CustomerContract.sol** :

    modifier onlyCustomer() {
        require (_myConfig.customerAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier isContractActive() {
        require(_myConfig.isActive, "Contract off line");
        _;
    }

If the customer's address isnt part of the struct **Config**, the **onlyCustomer** test of the **addService** function will revert an **"Access denied"** error.

The **addService** test has the following structure :

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

Through our tests, we also check if each function operates properly.
We also reconciliate expected results and effective results.
We test every **require** to ensure that every data sent as parameters are being saved in the **structs**. 
