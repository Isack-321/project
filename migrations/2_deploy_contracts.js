var SimpleStorage = artifacts.require("./Election.sol");

module.exports = function(deployer) {
  deployer.deploy(SimpleStorage);
};
