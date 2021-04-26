# Design Pattern Decisions

This section explains why we chose the design patterns we are using in the code. 


- Behavioral Patterns
    - [x] **Guard Check**: Ensure that the behavior of a smart contract and its input parameters are as expected.
    - [x] State Machine: Enable a contract to go through different stages with different corresponding functionality exposed.
    - [] **Oracle**: Gain access to data stored outside of the blockchain.
    - [ ] Randomness: Generate a random number of a predefined interval in the deterministic environment of a blockchain.
- Security Patterns
    - [x] **Access Restriction**: Restrict the access to contract functionality according to suitable criteria.
    - [ ] Checks Effects Interactions: Reduce the attack surface for malicious contracts trying to hijack control flow after an external call.
    - [ ] Secure Ether Transfer: Secure transfer of ether from a contract to another address.
    - [ ] **Pull over Push**: Shift the risk associated with transferring ether to the user.
    - [x] Emergency Stop: Add an option to disable critical contract functionality in case of an emergency.
- Upgradeability Patterns
    - [ ] Proxy Delegate: Introduce the possibility to upgrade smart contracts without breaking any dependencies.
    - [ ] Eternal Storage: Keep contract storage after a smart contract upgrade.
- Economic Patterns
    - [ ] String Equality Comparison: Check for the equality of two provided strings in a way that minimizes average gas consumption for a large number of different inputs.
    - [x] Tight Variable Packing: Optimize gas consumption when storing or loading statically-sized variables.
    - [ ] Memory Array Building: Aggregate and retrieve data from contract storage in a gas efficient way.

[Reference](https://fravoll.github.io/solidity-patterns/)

Pour nos **smart contracts**, nous avons naturellement mis en place plusieurs bonnes pratiques présentes dans [https://fravoll.github.io/solidity-patterns/](https://fravoll.github.io/solidity-patterns/)

## Guard Check

Par l'intermédiaire de plusieurs **modifiers**, nous vérifions que l'appel aux fonctions se fait correctement. En vérifiant la validation des données. Exemple :

    modifier isAddressValid(address _addr){
        require(_addr != address(0));
        _;
    }

## State Machine

Nos contrats n'ayant pas pour objectif d'ordonner un workflow, le **State Machine** se concentre sur la disponinilité des différentes actions. Est-ce qu'un **service** a un **statut active**, est-ce qu'un **seuil d'alerte** est **actif** ? Ces états sont consultés par le Guard Check et modifié par qui de droit :

    function toggleContract()
        onlyOwner() external {
        emit ContractUpdate("Contract on/off", msg.sender);
        _myConfig.isActive = !_myConfig.isActive;
    }

## Oracle

Notre application se base sur la prise d'informations issus des capteurs. Ces informations sont traitées par un serveur de confiance dont l'installateur est certifié par notre solution. À ce titre là, l'emploi d'**Oracle** n'est pas nécessaire.

## Randomness

Notre application n'a nul besoin de donnée aléatoire. Mais si cela était nécessaire, le bridge serait parfait pour cela.

## Access Restriction

Comme détaillé dans la partie **Guard Check**, chaque contrat client dispose de services dont certaines adresses possèdent des droit particuliers.

    /**
     * @dev Structure of Service
     * @notice Feature_V2 
     */
    struct Service {
        bytes8 version;
        bytes8 measureType;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        bool isAllowed;
        string description;
        address bridgeAddress;
        address techMasterAddress;
        address legislatorAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter IotIdCounter;     
    }

Ces adresses ne sont renseignées que par des utilisateurs acceptés :

    /**
     * @dev set a TechMasterAddress
     * @param _serviceId index of service 
     * @param _techMasterAddress techMaster's address
     */
    function setTechMasterAddress(
        uint _serviceId,
        address _techMasterAddress)
        isContractActive() isServiceActive(_serviceId) onlyOwner() external {  
        
        _services[_serviceId].techMasterAddress = _techMasterAddress;

        emit ServiceUpdate(_serviceId, "Bridge Address update", msg.sender);
    }
    
La vérification de ces adresses pour les actions est encadrée par notre **Guard Check**.

## Checks Effects Interactions

-> Les actions sont déjà bridées par utilisateur, par adresse.

L'implémentation d'un **ERC-20** est en cours de réalisation. Le contrôle de l'intéraction s'assurera de la bonne tenue des paiements réalisés par l'**ERC-20** en question.

## Secure Ether Transfer

*L'application ne prévoit pas de dépôt et de transfert d'ETH.*

## Pull over Push

*L'application ne prévoit pas de dépôt et de transfert d'ETH.*

## Emergency Stop

*L'application ne prévoit pas de dépôt et de transfert d'ETH.* Et l'**Owner** peut désactiver le **contract du client** en cas de mauvais paiement ou non respect des consignes d'Eco-capt.

## Proxy Delegate

*Non utilisé dans notre projet*

## Eternal Storage

Nous avons prévu que chaque contrat client soit versionné. L'ensemble des donneés (rapport de mesures, services) est donc conservé et accessible même si à l'avenir le client passe sur un nouveau contrat qui offrirait plus de fonctionnalités. La structure **Config** est en charge d'assurer cette possibilité à l'avenir.

    /**
    * @dev Structure of Configuration
    * @notice Version and status of activation
    * @notice Link to other contract
    */
    struct Config {
        bytes8 version;
        uint32 clientId;
        uint64 prevContractDate;
        uint64 nextContractDate;
        address customerAddress;
        address prevContract;
        address nextContract;
        bool isActive;
    }

## String Equality Comparison

--> Pour les **KYC** prévus dans la roadmap, il sera nécessaire de prévoir des comparaisons de chaines de caractères.


## Tight Variable Packing

L'ordre des variables de nos structures est étudié pour packer dans la mesure du possible les différentes tailles de variable :

    /**
     * @dev Structure of Service
     * @notice Feature_V2 
     */
    struct Service {
        bytes8 version;
        bytes8 measureType;
        bytes1 timeCode;
        uint8 nbTime;
        bool isActive;
        bool isAllowed;
        string description;
        address bridgeAddress;
        address techMasterAddress;
        address legislatorAddress;

        Counters.Counter measureIdCounter;
        Counters.Counter IotIdCounter;     
    }

Cette bonne pratique sera totalement effective sur la fin du projet.

Pour finir, les données vouées à être nombreuses sont compactées de manière économique en **bytes32**, même si elles sont composites.

    // struct mesure en-tête (32) { 
    //   //V0.1     XX.XX.XX    00.01.00
    //   Version : bytes8;
    //   Date : YYYYmmddHHii : byte12
    //   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
    //   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
    //   Nb temporel : bytes3 
    // }

## Memory Array Building

Afin d'économier au mieux le gaz, nous utilisons systématiquement l'attribut **view** pour l'ensemble de nos getters :

    /**
    * @dev get a Config
    * @return config in memory
    */
    function getConfig() external view returns (Config memory) {
        return _myConfig;
    }

D'un autre côté, pour continuer à économiser au mieux le gaz, sans que cela soit du **Memory Array Building**. Nous favorisons l'emploi de **mapping** astucieux de manière à éviter l'emploi de boucle au maximum. Pour l'heure, aucune boucle n'est utilisée.

    Service[] private _services;
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => Iot[]) private _serviceMacIOT;
    Counters.Counter public _serviceIdCounter;

Afin d'optimiser au mieux nos smart contracts, nous passons les mesures par Events.
En effet, une fois envoyées par le bridge, elles ne sont plus utilisées pour des calculs et ne sont pas modifiées.
La Dapps peut donc y acceder sans que ces données encombrent le contrat.