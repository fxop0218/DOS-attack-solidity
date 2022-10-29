// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract GoodWithoutVul {
    address public s_currentWinner;
    uint256 public s_currentAuctionPrice;
    mapping(address => uint256) public s_balances; // add this to prevent the vulnerability

    constructor() {
        s_currentWinner = msg.sender;
    }

    // Function without vulnerability
    function setCurrentAuctionPrice() public payable {
        require(
            msg.value > s_currentAuctionPrice,
            "Need more money that the actual currect price"
        );
        s_balances[s_currentWinner] += s_currentAuctionPrice;
        s_currentAuctionPrice = msg.value;
        s_currentWinner = msg.sender;
    }

    function withdraw() public {
        require(
            msg.sender != s_currentWinner,
            "Only the current winner can withdraw"
        );
        uint256 amount = s_balances[msg.sender];
        s_balances[msg.sender] = 0;
        (bool send, ) = msg.sender.call{value: amount}(""); // Use require to prevent DOS attack
        require(send, "Failed to sent ether");
    }
}
