module.exports = class HdWallet {
    constructor(web3) {
      this.web3 = web3;
    }
  
    mnemonic() {
        const bip39 = require('bip39');
        const hdkey = require('ethereumjs-wallet/hdkey');
        const util = require('ethereumjs-util');
    
        const mnemonic = bip39.generateMnemonic();
        const seed = bip39.mnemonicToSeed(mnemonic);      
        const hdwallet = hdkey.fromMasterSeed(seed);  
        const wallet = hdwallet.derivePath("m/44'/60'/0'/0/0").getWallet();

        const address = util.toChecksumAddress(wallet.getAddress().toString('hex'));
        const privateKey = util.toChecksumAddress(wallet.getPrivateKey().toString('hex'));
        // const account = this.web3.eth.accounts.privateKeyToAccount(privateKey);
        return {"mnemonic":mnemonic, "ethereum":{"address": address, "privateKey": privateKey}};
    }

    async SignedTransaction(from, to, value, key){
        var Tx = require('ethereumjs-tx');
        
        var amount = Number(this.web3.utils.toWei(value ,'ether'));
        var nonce = await this.web3.eth.getTransactionCount(from);
        var gasLimit = await this.web3.eth.getBlock("pending");
        var gasPrice = await this.web3.eth.getGasPrice();
        var gas = 21000;
        var rawTransaction = {
            "from": from,
            "nonce": this.web3.utils.toHex(nonce),
            "gas": this.web3.utils.toHex(gas),
            "gasPrice": this.web3.utils.toHex(gasPrice),
            "gasLimit": this.web3.utils.toHex(gasLimit.gasLimit),
            "to": to,
            "value": amount
        };

        var estimateGas = await this.web3.eth.estimateGas(rawTransaction);
        gas = estimateGas;
        var balance = await this.web3.eth.getBalance(from, Number);
        var cost = gasPrice * estimateGas;

        if(amount >= balance){
            amount = balance - cost;
        }else if(amount + cost >= balance){
            amount = balance - cost
        }
        // console.log(gas)
        // console.log(balance)
        // console.log(amount)
        // console.log(rawTransaction)
        
        var privateKey = new Buffer.from(key, 'hex');
        var tx = new Tx(rawTransaction);
        tx.sign(privateKey);
        var serializedTx = tx.serialize();
    
        this.web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
            console.log("Results: ", txhash)
            return txhash;
        });    
    
    }
    
    async SignedTransaction2(privateKey, to, value){
        var account = this.web3.eth.accounts.privateKeyToAccount("0x"+privateKey);
        console.log(account)
        var nonce = await this.web3.eth.getTransactionCount(account.address);
        var gasPrice = await this.web3.eth.getGasPrice();
        var gas = 21000;
        var rawTransaction = {
            "nonce":  this.web3.utils.toHex(nonce),
            "from": account.address,
            "to": to,
            "gas": this.web3.utils.toHex(gas),
            "value": this.web3.utils.toWei(value ,'ether'),
            "gasPrice": this.web3.utils.toHex(gasPrice),
            "data": "0x00"
        }

        var estimateGas = await this.web3.eth.estimateGas(rawTransaction);
        if(estimateGas > gas){
            gas = estimateGas;
        }
        console.log(rawTransaction)
        var sign = await this.web3.eth.accounts.signTransaction(rawTransaction, account.privateKey);
        console.log("Results: ", sign)
        this.web3.eth.sendSignedTransaction(sign.rawTransaction).on('receipt', console.log);
    }

};