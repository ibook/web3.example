const fs = require('fs');
const config = require('./config.js');
// console.log(config.contracts);
module.exports = class Keystore {
    constructor(web3) {
      this.web3 = web3;
    }
    test(){
        return {"aaa": 111, 'BBB':222};
    }
    async getBalanceAll(account){
        var obj = {};
        obj['ETH'] = await this.web3.eth.getBalance(account);
        var contracts = config.contracts;
        for(let symbol in contracts) {
            try{
                console.log(symbol,contracts[symbol]);  
                var abi = fs.readFileSync( __dirname + '/abi/'+symbol+'.abi', 'utf-8');
                var contract = new this.web3.eth.Contract(JSON.parse(abi), contracts[symbol], { from: config.coinbase , gas: 100000});
                var balance = await contract.methods.balanceOf(account).call();
                obj[symbol] = balance;
                console.log(symbol,balance);
            }catch(error){
                console.log(error.message);
            }
        }
        console.log(JSON.stringify(obj));
        return obj;
    }
}