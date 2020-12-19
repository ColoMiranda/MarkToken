// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./MarkToken.sol";

contract MarkTokenSale {

    address payable private admin; // declares the contract admin address
    MarkToken public tokenContract; // declares MarkToken.sol as the token contract
    uint256 public tokenPrice; // declares the token price
    uint256 public tokenSold; // declares a variable that keeps track of the amount fo tokens sold

    event Sell(
        address _buyer,
        uint256 _amount
    );

    constructor (MarkToken _tokenContract, uint256 _tokenPrice) public {

        admin = msg.sender; // sets the deployer as the contract admin
        
        tokenContract = _tokenContract; // sets the token contract address as the address for the tokenContract variable

        tokenPrice = _tokenPrice; // sets the token price to the value passed during the migration
    }

    //Safe Math multiply function
    function multiply(uint x, uint y) internal pure returns (uint z) {
        require(y == 0 || (z = x * y) / y == x);
    }
    
    function buyTokens(uint256 _numberOfTokens) public payable {

        require(tokenContract.balanceOf(address(this)) >= _numberOfTokens); // checks that the contract in charge of handling the sale has enough

        require(msg.value == multiply(_numberOfTokens, tokenPrice));

        require(tokenContract.transfer(msg.sender, _numberOfTokens));
        
        tokenSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

    }

    
    function endSale() public {
        
        require(msg.sender == admin);

        require(tokenContract.transfer(admin, tokenContract.balanceOf(address(this))));

        selfdestruct(admin);

    }
}