## design_pattern_desicions.md

Pour nos smart contracts, nous avons naturellement mis en place plusieurs bonnes pratiques présentes dans https://fravoll.github.io/solidity-patterns/

- Guard Check

Par l'intermédiaire de plusieurs modifiers, nous vérifions que l'appels aux fonctions se fait correctement. En vérifiant la validation des données. Exemple :

    modifier isAddressValid(address _addr){
        require(_addr != address(0));
        _;
    }

- State Machine

Nos contrats n'ayant pas pour objectif d'ordonner un workflow, le State Machine se concentre sur la disponinilité des différentes actions. Est-ce qu'un service est active, est-ce qu'un seuil d'alerte est actif ? Ces états sont consultés par le Guard Check et modifié par qui de droit :

    function toggleContract()
        onlyOwner() external {
        emit ContractUpdate("Contract on/off", msg.sender);
        _myConfig.isActive = !_myConfig.isActive;
    }   

- Oracle

Notre application se base sur la prise d'informations issus des capteurs. Ces informations sont traitées par un server de confiance dont l'installateur est certifié par notre solution. A ce titre là, l'emploi d'Oracle n'est pas nécessaire.

- Randomness

Notre application n'a nul besoin de donnée aléatoire. Mais si cela était nécessaire, le bridge sera parfait pour cela.

- Access Restriction

Comme détaillé dans la partie Guard Check, chaque contrat client dispose de services dont certaines adresses possèdent des droit particuliers.

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

Ces adresses ne sont renseignées que par des utilisateurs acceptées :

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

La vérification de ces adresses pour les actions est encadrées par notre Guard Check.

- Checks Effects Interactions

L'implémentation d'un ERC-20 est en cours de réalisation. Le contrôle de l'intéractions s'assurera de la bonne tenue des payements réalisés par l'ERC-20 en question.

- Secure Ether Transfer

L'application ne prévoit pas de dépôt et de transfert d'ETH.

- Pull over Push

L'application ne prévoit pas de dépôt et de transfert d'ETH.

- Emergency Stop

L'application ne prévoit pas de dépôt et de transfert d'ETH. Et l'Owner peut desactiver le contract du client en cas de mauvais payement ou non respect des consignes d'Eco-capt.

- Proxy Delegate

Non utilisé dans notre projet

- Eternal Storage

Nous avons prévu que chaque contract client soit versionné. L'ensemble des donneés (rapport de mesures, services) est donc conservés et accessible même si à l'avenir le client passe sur nouveau contrat offrait plus de fonctionnalités. La structure Config est en charge d'assurer cette possibilité à l'avenir.

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

- String Equality Comparison

Les rares strings utilisées dans notre application ne demande pas de comparaison. Par contre, pour la partie KYC enregistrée dans le contrat Ledger, nous utiliserons la fonction keccak256 afin de comparer les hashs des élements importants (SIRET, Nom de socièté, etc...)

- Tight Variable Packing

L'ordre des variables de nos structures est étudiés pour packer dans la mesure du possible les différentes tailles de variable :

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

Cette bonne pratique sera totalement effectif sur la fin du projet.

- Memory Array Building

Afin d'économier au mieux le gaz, nous utilisons systématiquement l'attribut view pour l'ensemble de nos getters :

    /**
    * @dev get a Config
    * @return config in memory
    */
    function getConfig() external view returns (Config memory) {
        return _myConfig;
    }

D'un autre côté, pour continuer à économiser au mieux le gaz, sans que cela soit du Memory Array Building. Nous favorisons l'emploi de mapping astucieux de manière à éviter l'emploi de boucle au maximum. Pour l'heure, aucune boucle n'est utilisé.

    Service[] private _services;
    mapping(uint => bytes32[]) private _serviceHeaderMeasures;
    mapping(uint => bytes32[]) private _serviceBodyMeasures;
    mapping(uint => Iot[]) private _serviceMacIOT;
    Counters.Counter public _serviceIdCounter;

Pour finir, les données vouées à être nombreuses sont compactés de manière économique en bytes32, même si elles sont composites.

// struct mesure en-tête (32) { 
//   //V0.1     XX.XX.XX    00.01.00
//   Version : bytes8;
//   Date : YYYYmmddHHii : byte12
//   Code de mesure : bytes8 - CODE : 4 chiffre/lettre pour la nature physique - 4 chiffre/lettre pour la version
//   Code temporel : bytes1 (Horaire, Journalier) Y m d H i
//   Nb temporel : bytes3 
// }



