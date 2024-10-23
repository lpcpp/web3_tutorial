const { task } = require("hardhat/config")


task("interact-fund", "合约交互").addParam("addr", "fund contract address").setAction(async(taskArgs, hre) => {

    const fundFactory = await ethers.getContractFactory("Fund")
    const fund = fundFactory.attach(taskArgs.addr)
    const [firstAccount, secondAccount] = await ethers.getSigners()
    const tx = await fund.transfer({value: ethers.parseEther("0.001")})
    await tx.wait()
    const balanceOfContract = await ethers.provider.getBalance(fund.target)
    console.log(`balanceOfContract is ${balanceOfContract}`)

    const tx2 = await fund.connect(secondAccount).transfer({value: ethers.parseEther("0.001")})
    await tx2.wait()

    const balanceOfContract2 = await ethers.provider.getBalance(fund.target)
    console.log(`balanceOfContract is ${balanceOfContract2}`)

    const firstAccountBalance = await fund.getValue(firstAccount.address)
    const secondAccountBalance = await fund.getValue(secondAccount.address)

    console.log(`first account ${firstAccount.address} balance is ${firstAccountBalance}`)
    console.log(`second account ${secondAccount.address} balance is ${secondAccountBalance}`)
})

module.exports = {}