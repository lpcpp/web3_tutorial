
const {ethers} = require("hardhat")

async function verify(fundAddress, args){
    await hre.run("verify:verify", {
        address: fundAddress,
        // constructorArguments: [],
    })
}

async function main(){
    const fundFactory = await ethers.getContractFactory("Fund")
    console.log("contract is deploying")
    const fund = await fundFactory.deploy()
    await fund.waitForDeployment()
    console.log("fund contract has been deployed success, address is " + fund.target)

    // 只有在seplia网络才verify contract
    if(hre.network.config.chainId == 11155111){
        console.log("waiting for 5 confirmations")
        await fund.deploymentTransaction().wait(5)
        await verify(fund.target)
    }else{
        console.log("verify skipped")
    }

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

}

main().then().catch((error)=>{
  console.error('error=', error)
  process.exit(1)
})