// SPDX-License-Identifier: MIT

contract GoodOwner {
    address public owner;

    constructor() {
        owner = msg.sender;
    }

    function setOwner(address newOwner) public {
        require(tx.origin == owner, "Not owwner");
        owner = newOwner;
    }
}
