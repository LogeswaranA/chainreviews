# BLOCKCHAIN Powered Reviews & Rewards System
* Implemented a DApp to create a platform for Reviews & Rewards System on Ethereum Framework.

#TEAM
* Logeswaran Audhikesavan
* Kushal Seth
* Shishir Agarwal

# GitHub Page
 Local instance of (https://github.com/LogeswaranAudhikesavan/chainreviews/)

# Inspiration:
* ETHIndia Hackathon

# What it does:
* Any users, will be able to submit their reviews on any products/services.- They will be represented as Reviewers.
* Any users, who is reviewing those reviews & can up-vote or down-vote basis their opinions.
* If a reviews get Upvoted, then a minute fraction of ether(Say - 0.0001) will be transferred to "Original Reviewer" address. 
* If a reviews get DownVoted, then nothing happens, except downvote count get increases. If Downvote limit reaches more than 50, then "original reviewers" will be deducted the minuet fraction of ether..(Say - 0.00001)
* Reviewers cannot upvote/downvote their own reviews, which helps eliminate fake review counts

# STEPS to Install / Setup

# Challenges:
* Faced issues using Metamask,sometimes RPC error occured
* Installing "Embark Status" was quite challenging. So we ended up using traditional method.
* Test case debugging

# Implementation:
* Developed using Solidity and web3.js
  * used node.js, web3 and solc compiler
  * used Remix for contract testing
  * Used truffle framework in order to the ease developement process
* Testing of smart contracts was done on 
  * Ganache (Private Local Blockchain)
* Testing was done using javascript instead of a solidity contract creation way.
* Javascript testing method used the Mocha framework
  
# Future Enhancements:
* It helps service provider to get the reviews from our Decentralized System & integrate that into centralized

# Build With:
* Solidity, MetaMask, Web3js, Truffle, Ganache, Shell script, EVM Framework. JQuery
