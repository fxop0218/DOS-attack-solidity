// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Good {
    address public s_currentWinner;
    uint256 public s_currentAuctionPrice;

    constructor() {
        s_currentWinner = msg.sender;
    }

    function setCurrentAuctionPrice() public payable {
        require(
            msg.value > s_currentAuctionPrice,
            "Need more money that the actual currect price"
        );
        (bool send, ) = s_currentWinner.call{value: s_currentAuctionPrice}("");
        if (send) {
            s_currentAuctionPrice = msg.value;
            s_currentWinner = msg.sender;
        }
    }
}
