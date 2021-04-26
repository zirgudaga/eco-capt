# avoiding_common_attacks.md

- [x] Re-Entrancy
- [x] Arithmetic Overflow and Underflow
- [ ] Self Destruct
- [ ] Accessing Private Data
- [ ] Delegatecall
- [ ] Source of Randomness
- [ ] Denial of Service
- [ ] Phishing with tx.origin
- [ ] Hiding Malicious Code with External Contract
- [ ] Honeypot
- [ ] Front Running
- [ ] Block Timestamp Manipulation
- [ ] Signature Replay

📌 Pour l'heure, voici l'ensemble des sécurités mises en place :

- Aucun emploi de smart contract extérieur possible hors le **contract Ledger**. L'adresse dudit **Ledger** sera renseignée au déploiement et ne pourra pas être modifiée.

- L'usage du **isOwner** pour l'ensemble des actions critiques du contrats.

- Un ensemble de **modifier** destinés à limiter l'accès des fonctionnalités par **status d'activation** ou par **identité certifiée** :

   ```modifier isAddressValid(address _addr){
        require(_addr != address(0));
        _;
    }

    modifier isContractActive() {
        require(_myConfig.isActive, "Contract off line");
        _;
    }

    modifier isServiceActive(uint _serviceId) {
        require(_serviceId < _serviceIdCounter.current(), "Service not exist"); 
        require(_services[_serviceId].isActive, "Service off line"); 
        require(_services[_serviceId].isAllowed, "Service not allowed"); 
        _;
    }

    modifier onlyCustomer() {
        require (_myConfig.customerAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyBridge(uint _serviceId) {
        require (_services[_serviceId].bridgeAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyTechMaster(uint _serviceId) {
        require (_services[_serviceId].techMasterAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }

    modifier onlyLegislator(uint _serviceId) {
        require (_services[_serviceId].legislatorAddress == msg.sender || owner() ==  msg.sender, "Access denied");
        _;
    }```

- La grande majorité des données sont en **private** afin de contrôler par nos **getters** l'information envoyée

- Usage de la librairie compteur d'**OpenZepellin** pour éviter les erreurs d'incrémentation

- L'emploi du **contrat Ledger** indiqué au déployement afin de vérifier  et valider l'identité certifiée des acteurs. *en cours*