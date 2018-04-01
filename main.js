var express = require('express');
var app = express();

app.use(express.static('public'));
app.set("view engine","ejs");
app.set('views', __dirname + '/views');  

var async = require('async');

fs = require('fs');
var net = require('net');
var Web3 = require('web3');
var web3 = new Web3('/Users/neo/Library/Ethereum/geth.ipc', net);
const abi = fs.readFileSync( __dirname + '/contract/TokenERC20.abi', 'utf-8');
const coinbase = "0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7"
const contractAddress = "0x70682386d0dE84B1e549DC3c4305CCB2D261b2a8";

console.log(web3.version)


app.get('/', function (req, res) {
  //  res.send('Hello World');
   res.render("index",{}); 
})

app.get('/account.html', function (req, res) {
  var accounts;
  web3.eth.getAccounts(function(err, acc) {
    accounts = acc
    res.render("account",{"accounts":accounts}); 
  });
})

app.get('/balance.html', function (req, res) {
  // web3.eth.getAccounts().then(console.log);
  // var accounts;
  // var balances = new Array();

  // async.waterfall([
  //   function(callback){
  //     web3.eth.getAccounts(function(err, acc) {
  //       callback(null, acc);
  //     });
      
  //   },
  //   function(accounts, callback){
  //     console.log(accounts)
  //     accounts.forEach(function(account,index) {
  //       web3.eth.getBalance(account).then(function(bal){
  //         console.log(bal);
  //         balances.push({"account": account, "balance": bal})
  //       });
  //     });
  //     callback(null, balances);
  //   },
  //   function(bal,callback){
  //     console.log(balances);
  //   }
  // ], function (err, result) {
  //    // result now equals 'done'
  //    console.log(result);
     
  //   //  res.render("balance",{"accounts":accounts}); 
  // });
  web3.eth.getAccounts(function(err, accounts) {
    res.render("balance",{"accounts":accounts}); 
  });
})
app.post('/showbalance.html', function (req, res) {
  // web3.eth.getBalance(req.query.account).then(function(balance){
  //   res.render("transfer",{"account":req.query.account, "balance": balance}); 
  // });
  
  res.render("showbalance",{"account": "sss", "balance": 1000}); 
})

app.get('/getbalance.html', function (req, res) {
  var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: coinbase , gas: 100000});
  web3.eth.getBalance(req.query.account).then(function(balance){
    contract.methods.balanceOf(req.query.account).call().then(function(token){
      // console.log(contract.symbol.call());
      // contract.methods.symbol().call().then(console.log);
      contract.methods.name().call().then(function(name){
        res.render("showbalance",{"account":req.query.account, "balance": web3.utils.fromWei(balance, 'ether'), "token": token, "name": name}); 
      });
      
    });
    
  });
})

app.get('/transfer.html', function (req, res) {
  web3.eth.getAccounts(function(err, accounts) {
    res.render("transfer",{"accounts":accounts}); 
  });
})
app.get('/transfer.html', function (req, res) {
  web3.eth.getAccounts(function(err, accounts) {
    res.render("transfer",{"accounts":accounts}); 
  });
})

app.get('/send', function (req, res) {
  // console.log(req.query)
  web3.eth.personal.unlockAccount(req.query.from, req.query.password).then(function(error){
    if(req.query.token == "ETH"){  
      web3.eth.sendTransaction({
        from: req.query.from,
        to: req.query.to,
        value: web3.utils.toWei(req.query.amount ,'ether')
      },
      function(error, result){
          if(!error) {
              console.log("#" + result + "#")
              res.render("done",{"hash":result}); 
          } else {
              console.error(error);
          }
      });
      
    }else{
      var contract = new web3.eth.Contract(JSON.parse(abi), contractAddress, { from: req.query.from , gas: 1000000});
      contract.methods.transfer(req.query.to, req.query.amount).send().then(function(hash){
        console.log(hash)
        res.render("done",{"hash":hash.transactionHash}); 
      });
    }
  });
})

var server = app.listen(8080, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

