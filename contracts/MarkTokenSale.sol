// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

import "./MarkToken.sol";

contract MarkTokenSale {

    address admin; // declares the contract admin address
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

    function buyTokens(uint256 _numberOfTokens) public payable {

        tokenSold += _numberOfTokens;

        emit Sell(msg.sender, _numberOfTokens);

    }
}