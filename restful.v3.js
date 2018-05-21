
// --------------------------------------------------
const config = require('./config.js');
console.log(config.contracts);
const coinbase = config.coinbase;
const contracts = config.contracts;
// const ipc = '/home/ethereum/mainnet/geth.ipc';
const ipc = '/Users/neo/Library/Ethereum/geth.ipc';
// --------------------------------------------------

// ---------- Web3 ----------

fs = require('fs');
var net = require('net');
var Web3 = require('web3');
var web3 = new Web3(ipc, net);



const HdWallet = require('./hdwallet');
const hdWallet = new HdWallet(web3);
//hdWallet.SignedTransaction2("1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","10");
hdWallet.SignedTransaction("0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","7.84","1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601");
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

async function getEstimateGas(t){
    var estimateGas = await web3.eth.estimateGas(t);
    return estimateGas;
}
async function getFee(estimateGas){
    var gasPrice = await  web3.eth.getGasPrice();
    var cost = gasPrice * estimateGas;
    return cost;
}
router.post('/transfer.json', function (req, res) {
    var amount = web3.utils.toWei(req.body.amount ,'ether');
    var message = {};
    try{
        var transaction = {
            from: req.body.from,
            to: req.body.to,
            value: amount
        };

        web3.eth.getBalance(req.query.from, function (error, balance) {
            var estimateGas = getEstimateGas(transaction);
            var fee = getFee(estimateGas);
            if(amount >= balance){
                amount = balance - fee;
            }else if(amount + fee >= balance){
                amount = balance - fee
            }
        });

        web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
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
        contract.methods.balanceOf(req.query.address).call().then(function(balance){
            var message = {"status": true,"code":0, "data": {"account":req.query.address, "balance": balance, "symbol": req.query.symbol}};
            logger.info(message);
            res.json(message); 
        });
    }catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
})

router.get('/balance/token/all.json', function (req, res) {
    try{
        var message = {"status": true,"code":0, "data": {"account":req.query.address, "balances": getBalanceAll(req.query.address)}};
        logger.info(message);
        res.json(message); 
    
    }catch(error){
        var message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
})

async function getBalanceAll(account){
    var map = new Map();
    map.set('ETH', await web3.eth.getBalance(account));
    
    for(let symbol in contracts) {  
        console.log(symbol,);  
        var abi = fs.readFileSync( __dirname + '/abi/'+symbol+'.abi', 'utf-8');
        var contract = new web3.eth.Contract(JSON.parse(abi), contracts[symbol], { from: coinbase , gas: 100000});
        var balance = await contract.methods.balanceOf(account).call();
        map.set(symbol, balance);
    }
    return map;
}

router.post('/transfer/token.json', function (req, res) {
    try{
        web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
            const abi = fs.readFileSync( __dirname + '/abi/'+req.query.symbol+'.abi', 'utf-8');
            var contract = new web3.eth.Contract(JSON.parse(abi), contracts[req.query.symbol], { from: req.body.from , gas: 1000000});
            contract.methods.transfer(req.body.to, req.body.amount).send().then(function(tx){
                console.log(hash)
                res.json({"status":true, "code":0, "data":{"txhash":tx}}); 
            });
        });
    }catch(error){
         res.json({"status": false, "code":1, "data":{"error":error.message}});
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
    try{
        var txbash = hdWallet.SignedTransaction(req.body.from, req.body.to, req.body.value, req.body.key);
        var message = {"status":true, "code":0, "data":{"txhash":txhash}};
        logger.info(message);
        res.json(message); 
    }catch(error){
        message = {"status": false, "code":1, "data":{"error":error.message}};
        logger.error(message);
        res.json(message);
    };
});

app.use('/keystore', router);




var port = process.env.PORT || 8000;  
app.listen(port, '0.0.0.0');
