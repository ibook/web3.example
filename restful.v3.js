
// --------------------------------------------------
const config = require('./config.js');
// console.log(config.contracts);
const coinbase = config.coinbase;
const contracts = config.contracts;
// const ipc = '/home/ethereum/mainnet/geth.ipc';
const ipc = '/Users/neo/Library/Ethereum/geth.ipc';
// --------------------------------------------------

// ---------- Web3 ----------

const fs = require('fs');
const net = require('net');
const Web3 = require('web3');
const web3 = new Web3(ipc, net);
const Tx = require('ethereumjs-tx');
const BigNumber = require('bignumber.js');

const Keystore = require('./keystore');
const keystore = new Keystore(web3);
const HdWallet = require('./hdwallet');
const hdWallet = new HdWallet(web3);
//hdWallet.SignedTransaction2("1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","10");
// hdWallet.SignedTransaction("0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","7.84","1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601");
// console.log(keystore.getBalanceAll("0xa745D295d2E35B16b2F41da48D9883CcE3c609a7"));
// console.log(keystore.getBalanceToken("0xa745D295d2E35B16b2F41da48D9883CcE3c609a7","NEO"));
// console.log(JSON.stringify(tk));
// console.log(hdWallet.mnemonic());
// console.log(`The mnemonic is ${hdWallet.mnemonic().toString()}`);
// ---------- express ----------

var express    = require('express');
var app        = express(); 
var router = express.Router();

var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(allowCrossDomain);

// ---------- Log4js ----------

const log4js = require('log4js');
log4js.configure({
  appenders: { ethereum: { type: 'file', filename: __dirname + '/log/' +'ethereum.log' } },
  categories: { default: { appenders: ['ethereum'], level: 'error' } }
});
 
const logger = log4js.getLogger('ethereum');

// ---------- Restful ----------

router.get('/', function(req, res) {
    res.json({ "status": true, message: 'welcome to ethereum api!' });   
});

router.get('/account/list.json', function(req, res) {
    try {
        web3.eth.getAccounts(function(err, accounts) {
            var message = {"status": true, "code":0, "data":{"accounts": accounts}};
            logger.info(message);
            res.json(message); 
        });
    } catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});

router.post('/account/new.json', function (req, res) {
    try {
        web3.eth.personal.newAccount(req.query.password).then(function(account){
            var message = {"status": true, "code":0, "data":{"account": account}};
            logger.info(message);
            res.json(message);
        });
    } catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});

router.get('/balance.json', function(req, res) {
    var message = {};
    try {
        web3.eth.getBalance(req.query.address, function (error, wei) {
            if (!error) {
                var balance = web3.utils.fromWei(wei, 'ether');
                message = {"status": true, "code":0, "data":{"account":req.query.address, "balance": balance}}; 
                logger.info(message);
                res.json(message); 
            }else{
                message = {"status": false, "code":1, "data":{"error":error.message}};
                logger.error(message);
                res.json(message);
            }
        });
    }
    catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };

});

router.get('/balance/spending.json', function(req, res) {
    var message = {};
    try {
        
        web3.eth.getBalance(req.query.address).then(function(wei) {

            web3.eth.getGasPrice().then(function(gasPrice){
                var price = gasPrice;
                web3.eth.estimateGas({
                    "from": req.query.address,
                    "to": coinbase,
                    "value": wei
                }).then(function(estimateGas){
                    var gas = estimateGas;
                    var cost = (gas * price);
                    var balance = web3.utils.fromWei(BigNumber(wei).minus(cost).toString(), 'ether');
                    message = {"status": true, "code":0, "data":{"account":req.query.address, "balance": balance, "wei": BigNumber(wei).minus(cost), "price": price, "gas": gas, "cost": cost }}; 
                    logger.info(message);
                    res.json(message); 
                });
            });
        });
    }
    catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };

});

router.post('/transfer.json', async function (req, res) {
    var amount = web3.utils.toWei(req.body.amount ,'ether');
    var message = {};
    var value = '';
    try{
        web3.eth.getBalance(req.body.from, Number).then(function(balance) {
            if(balance <= 0){
                message = {"status": false, "code":1, "data":{"error":"balance = 0"}};
                logger.error(message);
                res.json(message);
            }
            web3.eth.getGasPrice().then(function(gasPrice){
                var price = gasPrice;
                web3.eth.estimateGas({
                    "from": req.body.from,
                    "to": req.body.to,
                    "value": 0
                }).then(function(estimateGas){
                    var gas = estimateGas;
                    var cost = (gas * price);

                    if(Number(amount) >= balance){
                        value = web3.utils.toHex(BigNumber(balance).minus(cost));
                    }else if(BigNumber(amount).plus(cost).isGreaterThanOrEqualTo(value)){
                        value = web3.utils.toHex(BigNumber(balance).minus(cost));
                    }else{
                        value = web3.utils.toHex(amount);
                    }
                    
                    // console.log(balance);
                    // console.log(value);
                    // console.log(cost);

                    var transaction = {
                        "from": req.body.from,
                        "to": req.body.to,
                        "value": value,
                        "gas": gas
                    };

                    web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
                        if(!error){
                            message = {"status": false, "code":1, "data":{"error":error.message}};
                            logger.error(message);
                            res.json(message);
                        }
                        web3.eth.sendTransaction(transaction, function(error, tx){
                            if(!error) {
                                message = {"status":true, "code":0, "data":{"txhash":tx}};
                                logger.info(message);
                                res.json(message); 
                            } else {
                                message = {"status": false, "code":1, "data":{"error":error.message}};
                                logger.error(message);
                                res.json(message);
                            }
                        });
                    });
                });
            });
        });
    }catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});

router.get('/balance/token.json', function (req, res) {
    try{
        const abi = fs.readFileSync( __dirname + '/abi/'+req.query.symbol+'.abi', 'utf-8');
        var contract = new web3.eth.Contract(JSON.parse(abi), contracts[req.query.symbol], { from: coinbase , gas: 100000});
        contract.methods.balanceOf(req.query.address).call().then(function(wei){
            contract.methods.decimals().call().then(function(decimals){
                if(wei > 0){
                    var dot = ".";
                    var position = decimals * -1;
                    var balance = [wei.slice(0, position), dot, wei.slice(position)].join('');
                }else{
                    balance = wei;
                }
                var message = {"status": true,"code":0, "data": {"account":req.query.address, "balance": balance, "symbol": req.query.symbol, "decimals": decimals}};
                logger.info(message);
                res.json(message); 
            });
        });
    }catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
})



router.get('/balance/token/all.json', function (req, res) {
    try{
        var balances = getBalanceAll(req.query.address);
        console.log(JSON.stringify(balances));
        var message = {"status": true,"code":0, "data": {"account":req.query.address, "balances": balances}};
        logger.info(message);
        res.json(message); 
    }catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
})

router.post('/transfer/token.json', function (req, res) {
    try{
        web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
            const abi = fs.readFileSync( __dirname + '/abi/'+req.body.symbol+'.abi', 'utf-8');
            var contract = new web3.eth.Contract(JSON.parse(abi), contracts[req.body.symbol], { from: req.body.from , gas: 1000000});
            contract.methods.decimals().call().then(function(decimals){
                const amount = new BigNumber(req.body.amount).toFixed(Number(decimals)).toString().replace(".","");
                contract.methods.transfer(req.body.to, amount).send().then(function(txhash){
                    console.log(txhash)
                    var message = {"status":true, "code":0, "data":{"txhash":txhash}};
                    logger.info(message);
                    res.json(message);
                });
            });
        });
    }catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});


// ---------- Mnemonic ----------

router.get('/account/mnemonic.json', function (req, res) {
    var bip39 = require('bip39');
    var hdkey = require('ethereumjs-wallet/hdkey');
    var util = require('ethereumjs-util');

    var mnemonic = bip39.generateMnemonic();
    var seed = bip39.mnemonicToSeed(mnemonic);      
    var hdwallet = hdkey.fromMasterSeed(seed);  
    var wallet = hdwallet.derivePath("m/44'/60'/0'/0/0").getWallet();
    // var address = util.pubToAddress(wallet.getAddress().toString('hex'), true);
    address = util.toChecksumAddress(wallet.getAddress().toString('hex'));
    const privateKey = util.toChecksumAddress(wallet.getPrivateKey().toString('hex'));

    // console.log(address)
    // console.log(privateKey)

    const bitcoin = require('bitcoinjs-lib')
    const root = bitcoin.HDNode.fromSeedBuffer(seed)
    const bitcoinWallet = root.derivePath("m/44'/0'/0'/0/0");

    const bitcoinAddress = bitcoinWallet.getAddress();
    const wif = bitcoinWallet.keyPair.toWIF();

    try{
        var account = web3.eth.accounts.privateKeyToAccount(privateKey);
        res.json({"status": true, "code":0, "data":{"mnemonic":mnemonic, "ethereum":account, "bitcoin":{"address":bitcoinAddress, "privateKey":wif}}});
    }catch(error){
	    res.json({"status": false, "code":1, "data":{"error":error.message}});
    }
});

router.post('/transfer/sign.json', function (req, res) {
    var amount = web3.utils.toWei(req.body.amount ,'ether');
    var message = {};
    var value = 0;
    try{
        
        web3.eth.getGasPrice().then(function(gasPrice){
            var price = Number(gasPrice);
            web3.eth.estimateGas({
                "from": req.body.from,
                "to": req.body.to,
                "value": BigNumber(amount)
            }).then(function(estimateGas){
                var gas = estimateGas;
                web3.eth.getBalance(req.body.from, Number).then(function(balance) {
                    var cost = (gas * price);
                    if(balance <= 0 || balance < cost){
                        message = {"status": false, "code":1, "data":{"error":"balance = 0 or balance <  gas * price"}};
                        logger.error(message);
                        res.json(message);
                        return;
                    }else{
                        message = {"account": req.body.from, "balance": balance};
                        console.log(message);
                        logger.info(message);
                    }

                    if(Number(amount) >= balance){
                        value = web3.utils.toHex(BigNumber(balance).minus(cost));
                    }else if(BigNumber(amount).plus(cost).isGreaterThanOrEqualTo(balance)){
                        value = web3.utils.toHex(BigNumber(balance).minus(cost));
                    }else{
                        value = web3.utils.toHex(amount);
                    }
                    
                    // console.log(price);
                    // console.log(gas);
                    // console.log(cost);
                    // console.log(balance);
                    // console.log(amount);
                    // console.log(value);

                    logger.debug(`/transfer/sign.json - gas: ${gas}, price: ${price}, cost: ${cost}, balance: ${balance}, amount: ${amount}, value: ${value}`);

                    web3.eth.getTransactionCount(req.body.from).then(function(nonce){
 
                        var rawTransaction = {
                            "from": req.body.from,
                            "nonce": web3.utils.toHex(nonce),
                            "gas": web3.utils.toHex(gas),
                            "gasPrice": web3.utils.toHex(price),
                            // "gasLimit": this.web3.utils.toHex(gasLimit.gasLimit),
                            "to": req.body.to,
                            "value": web3.utils.toHex(value)
                        };

                        var privateKey = new Buffer.from(req.body.key, 'hex');
                        var tx = new Tx(rawTransaction);
                        tx.sign(privateKey);
                        var serializedTx = tx.serialize();
    
                        web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
                            message = {"status":true, "code":0, "data":{"txhash":txhash}};
                            logger.info(message);
                            res.json(message); 
                        }); 

                    });

                });
            });
        });
    }catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});
router.post('/transfer/token/sign.json', function (req, res) {
    const from    = req.body.from;
    const to      = req.body.to;
    
    const symbol  = req.body.symbol;
    const key     = req.body.key;

    var message = {};

    try{
        const abi = fs.readFileSync( __dirname + '/abi/'+symbol+'.abi', 'utf-8');
        const contractAddress = contracts[symbol];
        const contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { "from": from});

        contract.methods.balanceOf(from).call().then(function(balance){

            contract.methods.decimals().call().then(function(decimals){
                const amount = new BigNumber(req.body.amount).toFixed(Number(decimals)).toString().replace(".","");

                if(Number(amount) > Number(balance)){
                    message = {"status": false, "code":1, "data":{"error":"balance = " + balance}};
                    logger.error(message);
                    res.json(message);
                    return;
                }
            
                web3.eth.getGasPrice().then(function(gasPrice){
                    var price = Number(gasPrice);

                    web3.eth.getTransactionCount(from).then(function(nonce){

                        contract.methods.transfer(from, amount).estimateGas().then(function(gas){
                            var rawTransaction = {
                                "nonce": web3.utils.toHex(nonce),
                                "from": from,
                                "to": contractAddress,
                                "gas": web3.utils.toHex(gas),
                                "gasPrice": web3.utils.toHex(price),
                                // "gasLimit": this.web3.utils.toHex(gasLimit.gasLimit),
                                "value": "0x0",
                                "data": contract.methods.transfer(to, amount).encodeABI()
                            };
                            // console.log(`balance: ${balance}`);
                            // console.log(price);
                            // console.log(gas);
                            // console.log(amount);
                            // console.log(rawTransaction);
                            logger.debug(`/transfer/token/sign.json - gas: ${gas}, price: ${price}, cost: ${gas * price}, balance: ${balance}, amount: ${amount}, value: ${value}`);
                            // console.log(rawTransaction);
                            
                            var privateKey = new Buffer.from(key, 'hex');
                            var tx = new Tx(rawTransaction);
                            tx.sign(privateKey);
                            var serializedTx = tx.serialize();
            
                            web3.eth.sendSignedTransaction('0x' + serializedTx.toString('hex')).on('receipt', function(txhash){
                                message = {"status":true, "code":0, "data":{"txhash":txhash}};
                                logger.info(message);
                                res.json(message); 
                            }); 
                        });
                    });
                });
            });
        });
    }catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
    
});

app.use('/api', router);




var port = process.env.PORT || 8000;  
app.listen(port, '0.0.0.0');
