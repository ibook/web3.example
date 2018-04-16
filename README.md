# web3.js
web3.js Example

## Setup

    curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/gcc/gcc.sh | bash
    curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/node.js/binrary/node-v9.11.1.sh | bash
	curl -s https://raw.githubusercontent.com/oscm/shell/master/lang/node.js/binrary/profile.d.sh | bash

    npm install express web3
    npm install ejs
    npm install async

## Sol

    solc --bin --abi --optimize -o ./output TokenERC20.sol --overwrite 