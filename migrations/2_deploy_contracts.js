const MarkToken = artifacts.require("MarkToken");
const MarkTokenSale = artifacts.require("MarkTokenSale");

module.exports = function (deployer) {
  deployer.deploy(MarkToken, 1000000).then(function () {
    var tokenPrice = 1000000000000000; // in wei
    return deployer.deploy(MarkTokenSale, MarkToken.address, tokenPrice);
  });
};
