var MarkTokenSale = artifacts.require("./MarkTokenSale.sol");

contract("MarkTokenSale", function (accounts) {
  var tokenSaleInstance;
  var tokenPrice = 1000000000000000; // in wei
  var buyer = accounts[1];
  var numberOfTokens = 10;

  it("Initialized the contract with the correct values", function () {
    return MarkTokenSale.deployed()
      .then(function (instance) {
        tokenSaleInstance = instance;
        return tokenSaleInstance.address;
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "Has a contract address");
        return tokenSaleInstance.tokenContract();
      })
      .then(function (address) {
        assert.notEqual(address, 0x0, "Has a token contract address");
        return tokenSaleInstance.tokenPrice();
      })
      .then(function (price) {
        assert.equal(price, tokenPrice, "token price is correct");
      });
  });

  it("Facilitate token buy", function () {
    return MarkTokenSale.deployed().then(function (instance) {
      tokenSaleInstance = instance;
      return tokenSaleInstance
        .buyTokens(numberOfTokens, {
          from: buyer,
          value: numberOfTokens * tokenPrice,
        })
        .then(function (receipt) {
          assert.equal(receipt.logs.length, 1, "triggers one event");
          assert.equal(receipt.logs[0].event, "Sell", "Should be a Sell event");
          assert.equal(
            receipt.logs[0].args._buyer,
            accounts[1],
            "logs the account that purchased the tokens"
          );
          assert.equal(
            receipt.logs[0].args._amount,
            numberOfTokens,
            "increments the number of tokens sold"
          );
          return tokenSaleInstance.tokenSold();
        })
        .then(function (amount) {
          assert.equal(
            amount.toNumber(),
            numberOfTokens,
            "Increments the number of tokens sold"
          );
        });
    });
  });
});
