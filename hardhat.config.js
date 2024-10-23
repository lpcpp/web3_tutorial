
require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config()
require("@chainlink/env-enc").config()
// require("./tasks/deploy-fund")
// require("./tasks/interact-fund")
require("./tasks")

const {setGlobalDispatcher,ProxyAgent} = require("undici")
const proxyAgent = new ProxyAgent('http://127.0.0.1:1087')
setGlobalDispatcher(proxyAgent)

const SEPOLIA_URL = process.env.SEPOLIA_URL
const PRIVATE_KEY_1 = process.env.PRIVATE_KEY_1
const PRIVATE_KEY_2 = process.env.PRIVATE_KEY_2
const ETHERSCAN_APIKEY = process.env.ETHERSCAN_APIKEY

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.27",
  networks: {
    sepolia: {
      url: SEPOLIA_URL,
      accounts: [PRIVATE_KEY_1, PRIVATE_KEY_2],
      chainId: 11155111,
    }
  },
  etherscan: {
    apiKey: {
      sepolia: ETHERSCAN_APIKEY,
    },
    timeout: 600000, // 设置为 10 分钟的超时
  },
  // sourcify: {
  //   enabled: true
  // }
};
