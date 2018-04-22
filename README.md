# web3.js
web3.js Example

## Setup

### Root User

    curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/golang/golang-1.9.5.sh | bash
    curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/gcc/gcc.sh | bash
    curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/node.js/binrary/node-v9.11.1.sh | bash
	curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/node.js/binrary/profile.d.sh | bash
    curl -s https://raw.githubusercontent.com/oscm/shell/master/blockchain/ethereum/centos/go-ethereum-1.8.3.sh | bash


    npm install -g truffle

### Ethereum User

    npm install express web3
    npm install ejs
    npm install async

## Sol

    solc --bin --abi --optimize -o ./output TokenERC20.sol --overwrite

## Configure

    // 连接IPC地址
    var web3 = new Web3('/home/ethereum/private/geth.ipc', net);
    //矿工账号
    const coinbase = "0x3fbb5e96c9a643450b0e76c5c2122048fc733fc6"
    //代币合约地址
    const contractAddress = "0x654225e9415877d69252487a7cf9d49aeb42da88";