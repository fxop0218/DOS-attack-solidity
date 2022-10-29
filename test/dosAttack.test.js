const { ethers } = require("hardhat")
const { BigNumber } = require("ethers")
const { expect } = require("chai")

describe("DOS attack in smarct contract", () => {
    it("After being declared the winner, Attack.sol not allow to anyone else become the winner", async () => {
        // Let's deploy the good contract
        const goodContractFactory = await ethers.getContractFactory("Good")
        const goodContract = await goodContractFactory.deploy()
        await goodContract.deployed()
        console.log(`Good contract deployed with ${goodContract.address} address`)

        // Let's deploy the good contract
        const attackContractFactory = await ethers.getContractFactory("Attack")
        const attackContract = await attackContractFactory.deploy(goodContract.address)
        await attackContract.deployed()
        console.log(`Attack contract deployed with ${attackContract.address} address`)

        // let's foi the attack to the good contract
        // Get two addresses
        const [_, address1, address2] = await ethers.getSigners()

        // Set address1 as the winner
        let transaction = await goodContract
            .connect(address1)
            .setCurrentAuctionPrice({ value: ethers.utils.parseEther("1") })
        await transaction.wait()

        // Start the attack and make attack the current winner
        transaction = await attackContract.attack({
            value: ethers.utils.parseEther("3"),
        })
        transaction.wait()

        // Start the attack and change the current winner to address2

        transaction = await goodContract
            .connect(address2)
            .setCurrentAuctionPrice({ value: ethers.utils.parseEther("4") })
        transaction.wait()

        // The address 2 can't be the winner even if they sends more money
        // Becose thanks to attack.sol you can not modify the winner
        // Check the contract current winner
        expect(await goodContract.s_currentWinner()).to.equal(attackContract.address)
    })

    it("Test with correct builded smart contract, without vulnerability", async () => {
        const goodContractFactory = await ethers.getContractFactory("GoodWithoutVul")
        const goodContract = await goodContractFactory.deploy()
        await goodContract.deployed()
        console.log(`Good contract deployed with ${goodContract.address} address`)

        // Let's deploy the good contract
        const attackContractFactory = await ethers.getContractFactory("AttackWV")
        const attackContract = await attackContractFactory.deploy(goodContract.address)
        await attackContract.deployed()
        console.log(`Attack contract deployed with ${attackContract.address} address`)

        const [_, address1, address2] = await ethers.getSigners()

        // Start the attack and make attack the current winner
        transaction = await attackContract.attack({
            value: ethers.utils.parseEther("3"),
        })
        transaction.wait()

        // Start the attack and change the current winner to address2

        transaction = await goodContract
            .connect(address2)
            .setCurrentAuctionPrice({ value: ethers.utils.parseEther("4") })
        transaction.wait()

        // Now the winner is address2, becuease, the attack contract cannot exploit this vulneravility
        expect(await goodContract.s_currentWinner()).to.equal(address2.address)
    })

    it("DOS attack with tx.origin vulnerability", async () => {
        const [_, address1] = await ethers.getSigners()
        // Deploy GoodOwner contract
        const goodContractFactory = await ethers.getContractFactory("GoodOwner")
        const goodContract = await goodContractFactory.connect(address1).deploy()
        await goodContract.deployed()

        // Deploy attacker owner
        const attackContractOwner = await ethers.getContractFactory("AttackOwner")
        const attackContract = await attackContractOwner.deploy(goodContract.address)
        await attackContract.deployed()

        // do the attack and change the owner
        let transaction = await attackContract.connect(address1).attack()
        await transaction.wait()

        expect(await goodContract.owner()).to.equal(attackContract.address)
    })
})
