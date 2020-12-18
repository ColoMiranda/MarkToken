// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.8.0;

contract MarkToken {
    string public name = "MarkToken";
    string public symbol = "MARK";
    string public standard = "MarkToken v1.0";
    uint256 public totalSupply;

    event Transfer(
        // Declaration of a "transfer" event that is triggered when a transfer occurs. Required by ERC-20
        address indexed _from,
        address indexed _to,
        uint256 _value
    );

    event Approval(
        // Declaration of a "approval" event that is triggered when a delegated transfer is approved. Required by ERC-20
        address indexed _owner,
        address indexed _spender,
        uint256 _value
    );

    mapping(address => uint256) public balanceOf;
    mapping(address => mapping(address => uint256)) public allowance;

    constructor (uint256 _initialSupply) public {
        balanceOf[msg.sender] = _initialSupply;
        totalSupply = _initialSupply;
    }

    function transfer(address _to, uint256 _value) public returns(bool success) {
        
        require(balanceOf[msg.sender] >= _value); // Checks that the address has enough tokens. Required by ERC-20
        
        balanceOf[msg.sender] -= _value; // Deducts funds from the sender's account
        
        balanceOf[_to] += _value; // Adds funds to the receiver's account

        emit Transfer(msg.sender, _to, _value); // Triggers the "Transfer" event. Required by ERC-20

        return true; // Retuns success true. Required by ERC-20
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        
        allowance[msg.sender][_spender] = _value;
        
        emit Approval(msg.sender, _spender, _value); // Triggers the "Approval" event. Required by ERC-20
        
        return true; // Retuns success true. Required by ERC-20
    }

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) {
        
        require(_value <= balanceOf[_from]); //checks that the fromAccount has enough funds
        require(_value <= allowance[_from][msg.sender]); //checks that the fromAccount has enough allowance

        balanceOf[_from] -= _value; // Deducts from the fromAccount
        balanceOf[_to] += _value; // Adds to the toAccount

        allowance[_from][msg.sender] -= _value; // If delegated trasnfer is sucessful, updates the allowance

        emit Transfer(_from, _to, _value); // Triggers the "Transfer" event. Required by ERC-20
        
        return true; // Retuns success true. Required by ERC-20
    }
}