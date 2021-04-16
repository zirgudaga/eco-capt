## avoiding_common_attacks.md

Pour l'heure, voici l'ensemble des sécurités mise en place :

1) Aucun emploi de contract extérieur possible hors le contract Ledger dont l'adresse sera renseigné au déployement et ne pourra pas être changée.

2) L'usage du isOwner pour l'ensemble des actions critiques du contrats.

3) Un ensemble de modifier destinés à limiter l'accès des fonctionnalités par status d'activiation ou par identité certifiée :

   modifier isAddressValid(address _addr){
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
    }

4) La grande majorité des données sont en private afin de contrôler par nos getters l'information envoyée.

5) Usage de la librairie compteur d'OpenZepellin pour éviter les erreurs d'incrémentation

6) L'emploi du contrat Ledger indiqué au déployement afin de vérifier valider l'identité certifiées des acteurs. (en cours)

