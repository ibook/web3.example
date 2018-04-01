var express = require('express');
var app = express();

app.use(express.static('public'));


fs = require('fs');
var net = require('net');
var Web3 = require('web3');
var web3 = new Web3('/Users/neo/Library/Ethereum/geth.ipc', net);

console.log(web3.version)


app.get('/', function (req, res) {
   res.send('Hello World');
})

app.get('/login.html', function (req, res) {
   res.sendFile( __dirname + "/" + "login.html" );
})
 
app.post('/login', function (req, res) {
 
   // 输出 JSON 格式
   var response = {
       "first_name":req.query.first_name,
       "last_name":req.query.last_name
   };
   console.log(response);
   res.end(JSON.stringify(response));
})

var server = app.listen(8080, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})

