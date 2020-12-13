var MarkToken = artifacts.require("./MarkToken.sol");

contract("MarkToken", function (accounts) {
  var tokenInstance;

  it("Initializes the contract with the correct values", function () {
    return MarkToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        return tokenInstance.name();
      })
      .then(function (name) {
        assert.equal(name, "MarkToken", "Has the correct name");
        return tokenInstance.symbol();
      })
      .then(function (symbol) {
        assert.equal(symbol, "MARK", "Has the correct symbol");
        return tokenInstance.standard();
      })
      .then(function (standard) {
        assert.equal(standard, "MarkToken v1.0", "Has the correct standard");
      });
  });

  it("Sets the total supply on deployment and allocates it to the Admin account", function () {
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
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (adminBalance) {
        assert.equal(
          adminBalance.toNumber(),
          1000000,
          "Initial supply is allocated to the Admin account balance"
        );
      });
  });

  it("Transfers token ownership", function () {
    return MarkToken.deployed()
      .then(function (instance) {
        tokenInstance = instance;
        // Test 'require' statement first by transferring something larger than the sender's balance
        return tokenInstance.transfer.call(accounts[1], 999999999999);
      })
      .then(assert.fail)
      .catch(function (error) {
        assert(
          error.message.indexOf("revert") >= 0,
          "error must contain revert"
        );
        return tokenInstance.transfer.call(accounts[1], 250000, {
          from: accounts[0],
        });
      })
      .then(function (success) {
        assert.equal(success, true, "it returns true");
        return tokenInstance.transfer(accounts[1], 250000, {
          from: accounts[0],
        });
      })
      .then(function (receipt) {
        assert.equal(receipt.logs.length, 1, "triggers one event");
        assert.equal(
          receipt.logs[0].event,
          "Transfer",
          "Should be a Transfer event"
        );
        assert.equal(
          receipt.logs[0].args._from,
          accounts[0],
          "logs the account the tokens are transferred from"
        );
        assert.equal(
          receipt.logs[0].args._to,
          accounts[1],
          "logs the account the tokens are transferred to"
        );
        assert.equal(
          receipt.logs[0].args._value,
          250000,
          "logs the transferred amount"
        );
        return tokenInstance.balanceOf(accounts[1]);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          250000,
          "adds the amount to the receiving account"
        );
        return tokenInstance.balanceOf(accounts[0]);
      })
      .then(function (balance) {
        assert.equal(
          balance.toNumber(),
          750000,
          "deducts the amount from the sending account"
        );
      });
  });
});
