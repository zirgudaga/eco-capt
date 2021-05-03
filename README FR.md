# eco-capt
 Projet de fin d'année Alyra


## Contributeurs

- [Hélène Bunel](https://github.com/Helene-mb)
- [Édouard Vahanian](https://github.com/edvahn)
- [Daniel Villa Monteiro](https://github.com/zirgudaga)
- [Jérémy Karsenty](https://github.com/jkarsenty)

## Démarrage

Les instructions suivantes vous permettrons d'installer le projet :
- Afin de cloner le projet, entrez la ligne de commande suivante : 
```npm clone https://github.com/zirgudaga/eco-capt```
- Afin d'installer les dépendances de test et de solidity, dans le dossier racine du projet, effectuez la commande : 
```npm install ```
- Afin d'installer les dépendances react, dans le dossier client du projet, effectuez la commande : 
```npm install```
- Pour lancer le déploiement de la Dapps, modifiez le fichier truffle-config.js avec le network approprié
- Pour déployer hors ganache, pensez à renseigner dans un fichier .env les variables environnement suivante :
```MNEMONIC```
```INFURA_ID```
- Lancez ensuite la migration avec la commande : 
```truffle migrate --network 'votre network'```
- Effectuez ensuite la commande suivante dans le dossier client : 
```npm run start```
- Rendez-vous sur votre http://localhost:3000/ pour interagir avec votre contrat
- Visitez la Dapps déployée sur Heroku : https://eco-capt-v4.herokuapp.com

## Guide d'utilisation

## Scénario du projet

📌  Ce projet permet de stocker sur la blockchain Ethereum des données liées aux émissions industrielles collectées par capteurs.
Les capteurs sont connectés au smart contract par l'intermédiaire d'un bridge ayant pour but de transformer une donnée brute en information stockable.
L'objectif est double : 
- Fournir un suivi aux industriels et leur permettre de montrer aux différents législateurs qu'ils respectent les normes environnementales en vigueur.
- Faciliter le suivi des legislateurs à travers l'usage de signaux d'alerte.

Les données sont donc consultables par tous, immuables.

### Processus d'élaboration d'un service.

- Un nouveau client peut enregistrer un nouveau service au travers d'un formulaire.
- Ce formulaire collecte une description, un choix de type de mesure, la version du service ainsi que la fréquence des enregistrements.
- Une fois un service déployé, la fondation peut désigner un TechMaster.
- Le TechMaster aura pour rôle d'installer le bridge, l'adresse du bridge, les adresses MAC connectées à ce bridge.
- Le client peut mettre des seuils d'alerte (formulaire).


### Progression

ClientContract livré  🚀
Contrat Parent en cours d'élaboration

### Visual Studio Code  🖥️

### Langage : Solidy, JS

### Framework : Truffle unbox React 

### Network : Ganache, Ropsten

## Contract actuel

Le smart contract actuel définit les évenements suivants : 
```
event MeasureReceive(uint _service_id, bytes32 _header, bytes32 _body, address _author);
event AlertReceive(uint _service_id, bytes32 _alert, address _author);
event ContractUpdate(string _message, address _author);      
event ServiceUpdate(uint _service_id, string _message, address _author); 
event ServiceElementUpdate(uint _service_id, uint _id, string _message, address _author);
```

