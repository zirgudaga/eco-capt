var ClientContract = artifacts.require("./ClientContract.sol");

module.exports = function(deployer) {
  deployer.deploy(ClientContract);
};
