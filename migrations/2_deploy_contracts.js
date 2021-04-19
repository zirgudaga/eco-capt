let LedgerContract = artifacts.require("./LedgerContract.sol");
let CustomerContract = artifacts.require("./CustomerContract.sol");

module.exports = function(deployer) {
    
    deployer.deploy(LedgerContract);
    
    deployer.deploy(CustomerContract,
        "0x30302e30312e3030",
        "0x0000000000000000000000000000000000000000", 
        "0xC9881C29c6e203d6DFa38fC0e3B426C84cA70056",
        "0x0000000000000000000000000000000000000000",
        0
    );       
};
