
// --------------------------------------------------
// const ipc = '/home/ethereum/mainnet/geth.ipc';
const ipc = '/Users/neo/Library/Ethereum/geth.ipc';
const coinbase = "0x3fbb5e96c9a643450b0e76c5c2122048fc733fc6";
const contractAddress = {
    'EOS':'0x86fa049857e0209aa7d9e616f7eb3b3b78ecfdb0',
    'FBC':'0x0c6df9bb12b32aeec1e117936457ed83ad8a1c70',
    'USDT':''
};
// --------------------------------------------------

var express    = require('express');
var app        = express(); 
var router = express.Router();

fs = require('fs');
var net = require('net');
var Web3 = require('web3');
var web3 = new Web3(ipc, net);

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

router.get('/', function(req, res) {
    res.json({ "status": true, message: 'welcome to ethereum api!' });   
});

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
    try{
        var account = web3.eth.accounts.privateKeyToAccount(privateKey);
        // web3.personal.importRawKey(privateKey,'12345678');
        res.json({"status": true, "code":0, "data":{"mnemonic":mnemonic, "account":account}});
    }catch(error){
	    res.json({"status": false, "code":1, "data":{"error":error.message}});
    }
});

router.get('/account/list.json', function(req, res) {
    web3.eth.getAccounts(function(err, accounts) {
        res.json({"status": true, "code":0, "data":accounts}); 
    });
});

router.post('/account/new.json', function (req, res) {
    web3.eth.personal.newAccount(req.query.password).then(function(account){
      res.json({"status": true, "code":0, "data":account});
    });
});


router.get('/balance.json', function(req, res) {

    //web3.eth.getBalance(req.query.address).then(function(balance){
    //	res.json({"status": true, "code":0, "data":{"account":req.query.address, "balance": web3.utils.fromWei(balance)}}); 
    // });


    try {
        web3.eth.getBalance(req.query.address, function (error, wei) {
            if (!error) {
                var balance = web3.utils.fromWei(wei, 'ether');
                res.json({"status": true, "code":0, "data":{"account":req.query.address, "balance": balance}}); 
            }else{
                console.log(error);
                res.json({"status": false, "code":1, "data":{"error":error.message}});
            }
        });
    }
    catch(error){
        res.json({"status": false, "code":1, "data":{"error":error.message}});
    };

});

router.post('/transfer.json', function (req, res) {

    try{
    web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
        web3.eth.sendTransaction({
          from: req.body.from,
          to: req.body.to,
          value: web3.utils.toWei(req.body.amount ,'ether')
        },
        function(error, result){
            if(!error) {
                console.log("#" + result + "#")
                res.json({"status":true, "code":0, "data":{"hash":result}}); 
            } else {
                console.error(error);
		res.json({"status":false, "code":1, "data":{"error":error.message}});
            }
        });
    });
    }catch(error){
         res.json({"status": false, "code":1, "data":{"error":error.message}});
    };
});


router.get('/balance/token.json', function (req, res) {
    // console.log(req.query.account);
    try{
        const abi = fs.readFileSync( __dirname + '/contract/output/TokenERC20.abi', 'utf-8');
        var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress[req.query.symbol], { from: coinbase , gas: 100000});
        contract.methods.balanceOf(req.query.address).call().then(function(balance){
        contract.methods.name().call().then(function(name){
          res.json({"status": true,"code":0, "data": {"account":req.query.address, "balance": balance, "name": name}}); 
        });  
    });
    }catch(error){
         res.json({"status": false, "code":1, "data":{"error":error.message}});
    };
})


router.post('/transfer/token.json', function (req, res) {
    try{
    web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
        var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress[req.query.symbol], { from: req.body.from , gas: 1000000});
        contract.methods.transfer(req.body.to, req.body.amount).send().then(function(hash){
          console.log(hash)
          res.json({"status":true, "code":0, "data":{"hash":hash.transactionHash}}); 
        });
    });
    }catch(error){
         res.json({"status": false, "code":1, "data":{"error":error.message}});
    };
});


app.use('/api', router);

var port = process.env.PORT || 8000;  
app.listen(port, '0.0.0.0');
