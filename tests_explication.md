## tests_explication.md 
Ce document doit expliquer les tests écrits et pourquoi vous les avez écrit.

Les tests du clientContract.sol ont été réalisé en parallèle des déploiements.
Nous avons ensuite décidé d'élaborer nos tests en amont afin d'écrire notre contrat ledgerContrat.sol en conséquence.
L'objectif est de tester toutes les fonctions de chaque smart contract afin de s'assurer du bon fonctionnement de ces derniers.

Concernant le contrat clientContract.sol par exemple, la fonction addService se doit d'être testée pour une question de securité.

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

Nous testons donc les accès aux fonctions au travers de modifiers présents dans clientContract.sol :

    modifier onlyCustomer() {
        require (_myConfig.customerAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier isContractActive() {
        require(_myConfig.isActive, "Contract off line");
        _;
    }

Si la personne faisant appel à cette fonction n'est pas présente dans le tableau des customers, le test onlyCustomer de la fonction addService renverra l'erreur "Access denied".

Le contrat test pour addService a donc la structure suivante :

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
        this.ClientContract.toggleContract({from: owner});        
        
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
        expect(myService.isActive).to.equal(true);
        expect(myService.bridgeAddress).to.equal(address0);
        expect(myService.techMasterAddress).to.equal(address0);
        expect(myService.legislatorAddress).to.equal(address0);        

        // L'event est bien envoyé par l'application
        expectEvent(receipt, "ContractUpdate", { _author: client });
    });
  
});

Au travers des tests nous vérifions également le bon déroulement de chaque fonction.
Nous effectuons également un rapprochement entre le résultat attendu du test et le résultat effectif.
Nous testons donc le respect des require afin que les données passées en paramètre soient correctement enregistrées dans les structs
