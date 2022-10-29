// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "./GoodWithoutVul.sol";

contract AttackWV {
    GoodWithoutVul s_good;

    constructor(address _good) {
        s_good = GoodWithoutVul(_good);
    }

    function attack() public payable {
        s_good.setCurrentAuctionPrice{value: msg.value}();
    }
}
