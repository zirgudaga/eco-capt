let LedgerContract = artifacts.require("./LedgerContract.sol");
let CustomerContract = artifacts.require("./CustomerContract.sol");

module.exports = async (deployer, _network, accounts) => {
    
    await deployer.deploy(LedgerContract);
    let customerContract;
    const myLedger = await LedgerContract.deployed();

    // Contrat du client 1    
    await deployer.deploy(CustomerContract,
        "0x30302e30312e3030",
        myLedger.address, 
        accounts[3], // ADRESSE DE VOTRE CLIENT 1 (CF VOTRE GANACHE)
        "0x0000000000000000000000000000000000000000",
        0
    );  

    customerContract = await CustomerContract.deployed();

    await myLedger.setCustomer(
        "Client 1",
        accounts[3],
        customerContract.address,
        1,
        true     
    );

    // Contrat du client 2
    await deployer.deploy(CustomerContract,
        "0x30302e30312e3030",
        myLedger.address, 
        accounts[4], // ADRESSE DE VOTRE CLIENT 2 (CF VOTRE GANACHE)
        "0x0000000000000000000000000000000000000000",
        0
    );  

    customerContract = await CustomerContract.deployed();
    
    await myLedger.setCustomer(
        "Client 2",
        accounts[4],
        customerContract.address,
        1,
        true     
    );

       
};
