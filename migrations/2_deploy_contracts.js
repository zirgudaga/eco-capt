let LedgerContract = artifacts.require("./LedgerContract.sol");
let CustomerContract = artifacts.require("./CustomerContract.sol");

module.exports = async (deployer, _network, accounts) => {
    
    await deployer.deploy(LedgerContract);
    let customerContract;
    const myLedger = await LedgerContract.deployed();

    await myLedger.setTechMaster(
        "Technician 1",
        accounts[1],
        1,
        true     
    );

    await myLedger.setLegislator(
        "Legislator 1",
        accounts[2],
        1,
        true     
    );
    
    await myLedger.setTypeMeasure(
        "Noise v1",
        "Noise measured in decibel dB",
        "0x4e4f495330303031",
        true,
        true     
    );

    await myLedger.setTypeMeasure(
        "Temperature v1",
        "Actual temperature in Celsius degree",
        "0x54454d5030303031",
        true,
        true     
    );

    await myLedger.setTypeMeasure(
        "Humidity v1",
        "Actual humidity in percentage",
        "0x484d445430303031",
        true,
        true     
    );

    await myLedger.setTypeMeasure(
        "Acidity v1",
        "Acidity measured with pH value",
        "0x4143445430303031",
        true,
        true     
    );

    await myLedger.setTypeMeasure(
        "Ammonium v1",
        "Ammonium concentration measured in mg by L",
        "0x414d4e4d30303031",
        true,
        true     
    );

    await myLedger.setTypeMeasure(
        "Nuclear Exposure v1",
        "Nuclear exposure in Coulomb by Kg",
        "0x4e55434c30303031",
        true,
        true     
    );
   
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
        "Customer 1",
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
        "Customer 2",
        accounts[4],
        customerContract.address,
        1,
        true     
    );

       
};
