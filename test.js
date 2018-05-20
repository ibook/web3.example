const fs = require('fs');
const net = require('net');
const Web3 = require('web3');
const web3 = new Web3('/Users/neo/Library/Ethereum/geth.ipc', net);
const abi = fs.readFileSync( __dirname + '/contract/output/TokenERC20.abi', 'utf-8');
const coinbase = "0x3fbb5e96c9a643450b0e76c5c2122048fc733fc6"
const contractAddress = "0x654225e9415877d69252487a7cf9d49aeb42da88" 

var gasLimit = web3.eth.getBlock("pending").gasLimit;
console.log(gasLimit)

var gasPrice = web3.eth.gasPrice
console.log(gasPrice)

var estimateGas = eth.estimateGas({from:eth.accounts[1], to: eth.accounts[2], value: web3.toWei(1)})
console.log(estimateGas)

var cost = estimateGas * gasPrice
console.log(cost)

personal.unlockAccount(eth.accounts[3], "12345678")	
eth.sendTransaction({from: eth.accounts[3], to: eth.accounts[5], value: eth.getBalance(eth.accounts[3]) - cost})