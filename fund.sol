// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";
import "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

contract Fund {
    mapping(address => uint256) fundMapping;

    uint256 public TARGET = 1; // 1 usdt
    address public owner;
    bool fundSuccess = false;
    address public erc20Contract;
    uint256 deployTimestamp;
    uint256 expires = 5 * 60; // 5 minutes

    AggregatorV3Interface dataFeed =
        AggregatorV3Interface(0x694AA1769357215DE4FAC081bf1f309aDC325306);

    constructor() {
        owner = msg.sender;
        deployTimestamp = block.timestamp;
    }

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    function setErc20Contract(address _erc20Contract) public onlyOwner {
        erc20Contract = _erc20Contract;
    }

    function transfer() public payable {
        fundMapping[msg.sender] += msg.value;
    }

    function withdraw() public {
        require(
            deployTimestamp + expires < block.timestamp,
            "withdraw time is not arrived"
        );
        require(
            address(this).balance >= TARGET,
            "\u4f17\u7b79\u672a\u8fbe\u5230\u76ee\u6807\u503c\uff0c\u6682\u4e0d\u53ef\u63d0\u73b0"
        ); //众筹未达到目标值，暂不可提现
        require(
            msg.sender == owner,
            "\u4ec5\u5408\u7ea6\u6240\u6709\u8005\u53ef\u63d0\u73b0"
        ); // 仅合约所有者可提现
        require(
            (uint256(getChainlinkDataFeedLatestAnswer()) *
                address(this).balance) /
                (10**18) >
                TARGET
        );
        payable(msg.sender).transfer(address(this).balance);
        fundSuccess = true;
    }

    function refund() public {
        require(
            deployTimestamp + expires < block.timestamp,
            "refund time is not arrived"
        );
        require(
            fundMapping[msg.sender] > 0,
            "\u60a8\u6ca1\u6709\u53c2\u4e0e\u672c\u4f17\u7b79"
        ); // 您没有参与本众筹
        require(fundSuccess == false, "fund success, you can not refund");
        payable(msg.sender).transfer(fundMapping[msg.sender]);
        fundMapping[msg.sender] = 0;
    }

    function minusRefund(address sender, uint256 amount) external {
        require(msg.sender == erc20Contract, "only erc20 contract can call this function");
        require(fundMapping[sender] >= amount, "you don't have enough fund");
        fundMapping[sender] -= amount;
    }

    function getValue(address funder) public view returns (uint256) {
        return fundMapping[funder];
    }

    function getChainlinkDataFeedLatestAnswer() public view returns (int256) {
        // prettier-ignore
        (
            /* uint80 roundID */,
            int answer,
            /*uint startedAt*/,
            /*uint timeStamp*/,
            /*uint80 answeredInRound*/
        ) = dataFeed.latestRoundData();
        return answer;
    }
}
