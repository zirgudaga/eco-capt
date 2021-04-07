var ClientContract = artifacts.require("./ClientContract.sol");

module.exports = function(deployer) {
    deployer.deploy(ClientContract, 
        "0x0102030405060708", 
        "0xC9881C29c6e203d6DFa38fC0e3B426C84cA70056",
        "0x0000000000000000000000000000000000000000",
        0
    );
};
