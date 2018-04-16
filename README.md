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