const fs = require('fs');
const config = require('./config.js');
console.log(config.contracts);
module.exports = class HdWallet {
    constructor(web3) {
      this.web3 = web3;
    }
    async getBalanceAll(account){
        var map = new Map();
        map.set('ETH', await this.web3.eth.getBalance(account));
        var contracts = config.contracts;
        for(let symbol in contracts) {  
            console.log(symbol,contracts[symbol]);  
            var abi = fs.readFileSync( __dirname + '/abi/'+symbol+'.abi', 'utf-8');
            var contract = new this.web3.eth.Contract(JSON.parse(abi), contracts[symbol], { from: coinbase , gas: 100000});
            var balance = await contract.methods.balanceOf(account).call();
            map.set(symbol, balance);
        }
        return map;
    }
}