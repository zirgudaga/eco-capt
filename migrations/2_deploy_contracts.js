let LedgerContract = artifacts.require("./LedgerContract.sol");
let CustomerContract = artifacts.require("./CustomerContract.sol");

module.exports = function(deployer, _network, accounts) {
    
    deployer.deploy(LedgerContract);
    
    // Contrat du client 1    
    deployer.deploy(CustomerContract,
        "0x30302e30312e3030",
        "0x0000000000000000000000000000000000000000", 
        accounts[3], // ADRESSE DE VOTRE CLIENT 1 (CF VOTRE GANACHE)
        "0x0000000000000000000000000000000000000000",
        0
    );  
    
    // Contrat du client 2
    deployer.deploy(CustomerContract,
        "0x30302e30312e3030",
        "0x0000000000000000000000000000000000000000", 
        accounts[4], // ADRESSE DE VOTRE CLIENT 2 (CF VOTRE GANACHE)
        "0x0000000000000000000000000000000000000000",
        0
    );      
};
