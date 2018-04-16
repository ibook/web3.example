var express    = require('express');
var app        = express();  
var router = express.Router();

fs = require('fs');
var net = require('net');
var Web3 = require('web3');
var web3 = new Web3('/Users/neo/Library/Ethereum/geth.ipc', net);
const abi = fs.readFileSync( __dirname + '/contract/output/TokenERC20.abi', 'utf-8');
//const coinbase = "0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7"
//const contractAddress = "0x70682386d0dE84B1e549DC3c4305CCB2D261b2a8";
const coinbase = "0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff"
// const contractAddress = "0xbd4c04E32C980B3c9B48f0E740A43Cf0f6012689"    // Neo
const contractAddress = "0x4801CdA51d356B93E28b7594fCF36283F92336e3"    // BSCC

var bodyParser     =        require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

router.get('/', function(req, res) {
    res.json({ "status": true, message: 'welcome to ethereum api!' });   
});

router.get('/account/list.json', function(req, res) {
    web3.eth.getAccounts(function(err, accounts) {
        res.json({"status": true, "code":0, "data":accounts}); 
    });
});

router.post('/account/new.json', function (req, res) {
    // console.log(req.body.password)
    web3.eth.personal.newAccount(req.query.password).then(function(account){
      res.json({"status": true, "code":0, "data":account});
    });
});

router.get('/balance.json', function(req, res) {
    // console.log(req.query.address);
    web3.eth.getBalance(req.query.address).then(function(balance){
        res.json({"status": true, "code":0, "data":{"account":req.query.address, "balance": web3.utils.fromWei(balance)}}); 
    });
});

router.get('/balance/token.json', function (req, res) {
    // console.log(req.query.account);
    var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: coinbase , gas: 100000});
    contract.methods.balanceOf(req.query.address).call().then(function(balance){
        contract.methods.name().call().then(function(name){
          res.json({"status": true,"code":0, "data": {"account":req.query.address, "balance": balance, "name": name}}); 
        });  
    });
})

router.post('/transfer.json', function (req, res) {
    // console.log(req.query)
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
            }
        });
    });
});
router.post('/transfer/token.json', function (req, res) {
    web3.eth.personal.unlockAccount(req.body.from, req.body.password).then(function(error){
        var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: req.body.from , gas: 1000000});
        contract.methods.transfer(req.body.to, req.body.amount).send().then(function(hash){
          console.log(hash)
          res.json({"status":true, "code":0, "data":{"hash":hash.transactionHash}}); 
        });
    });
});

app.use('/api', router);

var port = process.env.PORT || 8000;  
app.listen(port);