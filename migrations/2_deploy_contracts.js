const MarkToken = artifacts.require("MarkToken");

module.exports = function (deployer) {
  deployer.deploy(MarkToken);
};
