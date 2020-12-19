var MarkTokenSale = artifacts.require("./MarkTokenSale.sol");
var MarkToken = artifacts.require("./MarkToken.sol");

contract("MarkTokenSale", function (accounts) {
  var tokenSaleInstance;
  var tokenInstance;
  var tokenPrice = 1000000000000000; // in wei
  var admin = accounts[0];
  var buyer = accounts[1];
  var tokensAvailable = 750000;
  var numberOfTokens = 10;
  var deadContract = `Returned values aren't valid, did it run Out of Gas? You might also see this error if you are not using the correct ABI for the contract you are retrieving data from, requesting data from a block number that does not exist, or querying a node which is not fully synced.`;

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
    return MarkToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return MarkTokenSale.deployed()
        .then(function (instance) {
          tokenSaleInstance = instance;
          return tokenInstance.transfer(
            tokenSaleInstance.address,
            tokensAvailable,
            { from: admin }
          );
        })
        .then(function (receipt) {
          return tokenSaleInstance
            .buyTokens(numberOfTokens, {
              from: buyer,
              value: numberOfTokens * tokenPrice,
            })
            .then(function (receipt) {
              assert.equal(receipt.logs.length, 1, "triggers one event");
              assert.equal(
                receipt.logs[0].event,
                "Sell",
                "Should be a Sell event"
              );
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
              return tokenInstance.balanceOf(buyer);
            })
            .then(function (balance) {
              assert.equal(balance.toNumber(), numberOfTokens);
              return tokenInstance.balanceOf(tokenSaleInstance.address);
            })
            .then(function (balance) {
              assert.equal(
                balance.toNumber(),
                tokensAvailable - numberOfTokens
              );
              return tokenSaleInstance.buyTokens(numberOfTokens, {
                from: buyer,
                value: 1,
              });
            })
            .then(assert.fail)
            .catch(function (error) {
              assert(
                error.message.indexOf("revert") >= 0,
                "msg.value must be equal to the number of tokens in wei"
              );
              return tokenSaleInstance.buyTokens(999999, {
                from: buyer,
                value: 1,
              });
            })
            .then(assert.fail)
            .catch(function (error) {
              assert(
                error.message.indexOf("revert") >= 0,
                "msg.value must be equal or less to the amount of tokens to be purchased"
              );
            });
        });
    });
  });

  it("Ends token sale", function () {
    return MarkToken.deployed().then(function (instance) {
      tokenInstance = instance;
      return MarkTokenSale.deployed()
        .then(function (instance) {
          tokenSaleInstance = instance;
          return tokenSaleInstance.endSale({ from: buyer });
        })
        .then(assert.fail)
        .catch(function (error) {
          assert(
            error.message.indexOf(
              "revert" >= 0,
              "Only the admin can end the sale"
            )
          );
          return tokenSaleInstance.endSale({ from: admin });
        })
        .then(function (receipt) {
          return tokenInstance.balanceOf(admin);
        })
        .then(function (balance) {
          assert.equal(
            balance.toNumber(),
            999990,
            "Retunrs all unsold MarkTokens to the admin"
          );
          return tokenSaleInstance.tokenPrice();
        })
        .then(assert.fail)
        .catch(function (error) {
          assert(
            error.message.indexOf(
              deadContract >= 0,
              "Contract was not destroyed"
            )
          );
        });
    });
  });
});
