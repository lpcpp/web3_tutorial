const { task } = require("hardhat/config")

async function verify(fundAddress, args){
    await hre.run("verify:verify", {
        address: fundAddress,
        // constructorArguments: [],
    })
}

task("deploy-fund", "部署和验证合约").setAction(async(taskArgs, hre) => {
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
})

module.exports = {}