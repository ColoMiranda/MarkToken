var MarkToken = artifacts.require("./MarkToken.sol");

contract("MarkToken", function (accounts) {
  it("sets the total supply on deployment", function () {
    return MarkToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.totalSupply();
      })
      .then(function (totalSupply) {
        assert.equal(
          totalSupply.toNumber(),
          1000000,
          "Total supply is 1,000,000"
        );
      });
  });
});
