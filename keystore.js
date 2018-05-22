const fs = require('fs');
const config = require('./config.js');
var contracts = config.contracts;
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
    getBalanceToken(address,symbol){
        var abi = fs.readFileSync( __dirname + '/abi/'+symbol+'.abi', 'utf-8');
        var contract = new this.web3.eth.Contract(JSON.parse(abi), contracts[symbol], { from: config.coinbase , gas: 100000});
        contract.methods.balanceOf(address).call().then(function(wei){
            contract.methods.decimals().call().then(function(decimals){
                var dot = ".";
                var position = decimals * -1;
                var balance = [wei.slice(0, position), dot, wei.slice(position)].join('');
                var message = {"account":address, "balance": balance, "symbol": symbol, "decimals": decimals};
                console.log(message);
                return message;
            });
        });
        return {};
    }
    async getEstimateGas(t){
        var estimateGas = await web3.eth.estimateGas(t);
        return estimateGas;
    }
    async getFee(estimateGas){
        var gasPrice = await web3.eth.getGasPrice();
        var cost = gasPrice * estimateGas;
        return cost;
    }
    async transfer(from,to,am,password){
        var amount = Number(web3.utils.toWei(am ,'ether'));
        var message = {};
        var value = 0;
        var gas = 0;
        try{
            var transaction = {
                "from": from,
                "to": to,
                "value": value,
                "gas":gas
            };
            console.log(transaction);
            console.log(amount);
            var balance = await web3.eth.getBalance(from, Number)
            var estimateGas = await web3.eth.estimateGas(transaction);
            gas = estimateGas;
            var gasPrice = await web3.eth.getGasPrice();
            var cost = gasPrice * estimateGas;
    
            console.log(estimateGas);
            if(amount >= value){
                value = balance - cost;
            }else if(amount + fee >= value){
                value = balance - cost
            }else{
                value = amount;
            }
                
            console.log(balance);
            console.log(value);
            console.log(cost);
    
            await web3.eth.personal.unlockAccount(from, password);
            var txhash = await web3.eth.sendTransaction(transaction);
            message = {"status":true, "code":0, "data":{"txhash":tx}};
            logger.info(message);
            return (message); 
     
       
        }catch(error){
            message = {"status": false, "code":1, "data":{"error":error.message}};
            logger.error(message);
            return(message);
        };
    }
}