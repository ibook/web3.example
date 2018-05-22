
## Account 

### List
	功能：获取账号列表
	请求：GET
	地址： http://localhost:8000/api/account/list.json
	演示：
    neo@MacBook-Pro ~/ethereum/web3.example % curl http://localhost:8000/api/account/list.json

    {"status":true,"code":0,"data":{"accounts":["0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff","0xa745D295d2E35B16b2F41da48D9883CcE3c609a7","0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","0x8efB99Ec55bCfBE2CFe47918f2d9E55FA732111f","0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad","0xF0688330101d53BD0C6ede2Ef04d33c2010e9a5d","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343"]}}

### New Account
	功能：创建以太坊账号
	请求：POST
	发送数据： password=123456  
	地址：http://localhost:8000/api/account/new.json
	演示：
	
    neo@MacBook-Pro ~/ethereum/web3.example % curl -XPOST -d 'password=123456' http://localhost:8000/api/account/new.json
    {"status":true,"code":0,"data":{"account":"0xbd38Cb8a53d1c051faF0F4E186f9ef2bBaEb308A"}}

## Ethereum balance ETH

	功能：获取指定账号 ETH 数量
	请求：GET
	参数：address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
	地址：http://localhost:8000/api/balance.json
	演示：
	
    % curl "http://localhost:8000/api/balance.json?address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6"
    {"status":true,"code":0,"data":{"account":"0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6","balance":"0"}}%

## Ethereum balance spending

	功能：计算可以支配的最大 ETH 金额，balance - fee
	curl "http://localhost:8000/api/balance/spending.json?address=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343"

	neo@MacBook-Pro ~/ethereum/web3.example % curl "http://localhost:8000/api/balance/spending.json?address=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343"
	{"status":true,"code":0,"data":{"account":"0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","balance":"98.770587102","wei":"98770587102000000000","price":"18000000000","gas":21000,"cost":378000000000000}}

## Transfer

### ETH

	功能：ETH 转账
	请求：POST
	参数：
		from=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343
		to=0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad
		amount=1000
		password=12345678
	地址：
		http://localhost:8000/api/transfer.json
		
	演示：
	
    % curl -XPOST -d 'from=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&to=0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad&amount=100&password=12345678' http://localhost:8000/api/transfer.json

    {"status":true,"code":0,"data":{"hash":"0x81ba2f2a79fb819c1cac544536e0a4df2d8417b64f3781299213a174a154d4de"}}% 

	curl -XPOST -d 'from=0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff&to=0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad&amount=1000000000&password=12345678' http://localhost:8000/api/transfer.json

### ETH Sign Transaction

	功能：私钥签名转账适用于 HDWallet
	请求：POST
	参数：
		from=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343
		to=0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad
		amount=1000
		key=1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601
	地址：
		http://localhost:8000/api/transfer/sign.json
		
	演示：

	% curl -XPOST -d 'from=0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080&to=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&amount=5&key=1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601' http://localhost:8000/api/transfer/sign.json

## Token

### Token balance

	功能：获取指定代币余额
	请求：GET
	参数：address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
        symbol=EOS
	地址：http://localhost:8000/api/balance/token.json
	演示：

    neo@MacBook-Pro ~/ethereum/web3.example % curl "http://localhost:8000/api/balance/token.json?address=0xa745D295d2E35B16b2F41da48D9883CcE3c609a7&symbol=ADC"
	{"status":true,"code":0,"data":{"account":"0xa745D295d2E35B16b2F41da48D9883CcE3c609a7","balance":"100.000000000000000000","symbol":"ADC","decimals":"18"}}

	curl "http://localhost:8000/api/balance/token.json?address=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&symbol=TT6"


### Token transfer
	功能：代币转账
	请求：POST
	参数：
		from=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
		to=0xC41c6579ec90dA887FbbeE99db96f139A78f7E87
		amount=100
		symbol=ADC
		password=12345678
	地址：
		http://localhost:8000/api/transfer/token.json
		
	演示：

    % curl -XPOST -d 'from=0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080&to=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&amount=100&symbol=ADC&password=12345678' http://localhost:8000/api/transfer/token.json
    
    neo@MacBook-Pro ~/ethereum/web3.example % curl -XPOST -d 'from=0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080&to=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&amount=100&symbol=ADC&password=12345678' http://localhost:8000/api/transfer/token.json
	
	{"status":true,"code":0,"data":{"txhash":{"blockHash":"0x1ba62b0692b08e13334a163f0446ceba64bf6eeecb4cacef9a2a02b470a1e981","blockNumber":7878,"contractAddress":null,"cumulativeGasUsed":38131,"from":"0x7cb22cb3d8a58ade32f3bfc3e6a4ded1efaee080","gasUsed":38131,"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000010000000000000000000000000000000000000000008000000000000000080000000000000000000000420000200000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000010000000000000000000080000000000000000000000000000000000000000000000000000000000001000","root":"0x2d0d9c01243726ffdee3bc2a928497f8b7508612220cefc647249498989b89dc","to":"0x8d33e4bd2516a96453b730016d6b09cbc5e0d488","transactionHash":"0x4d664612680eebb56efe9607f48af20afb8a7ff31f9c96e509c9f4bc80e46914","transactionIndex":0,"events":{"Transfer":{"address":"0x8d33E4Bd2516a96453b730016D6B09Cbc5e0d488","blockNumber":7878,"transactionHash":"0x4d664612680eebb56efe9607f48af20afb8a7ff31f9c96e509c9f4bc80e46914","transactionIndex":0,"blockHash":"0x1ba62b0692b08e13334a163f0446ceba64bf6eeecb4cacef9a2a02b470a1e981","logIndex":0,"removed":false,"id":"log_f935a529","returnValues":{"0":"0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","1":"0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","2":"100000000000000000000","from":"0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","to":"0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343","value":"100000000000000000000"},"event":"Transfer","signature":"0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","raw":{"data":"0x0000000000000000000000000000000000000000000000056bc75e2d63100000","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000007cb22cb3d8a58ade32f3bfc3e6a4ded1efaee080","0x000000000000000000000000fbfe02e82d22737ebbbadc1e07a47f6e3f226343"]}}}}}}


### Token Sign Transaction

请求：POST
	参数：
		from=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343
		to=0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad
		amount=1000
		symbol=TT6
		key=1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601
	地址：
		http://localhost:8000/api/transfer/sign.json
		
	演示：

	neo@MacBook-Pro ~/ethereum/web3.example % curl -XPOST -d 'from=0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080&to=0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343&amount=5&symbol=ADC&key=1b6e3fa7b65e324ee1e6be963e075c16397a4b3bc07414b30f4eccfdcc9b2601' http://localhost:8000/api/transfer/token/sign.json
	{"status":true,"code":0,"data":{"txhash":{"blockHash":"0xd1c24f1a323454465c0ededd7a64b3ccbd46463bbae2fb5022471507a5bcb78c","blockNumber":7803,"contractAddress":null,"cumulativeGasUsed":38067,"from":"0x7cb22cb3d8a58ade32f3bfc3e6a4ded1efaee080","gasUsed":38067,"logs":[{"address":"0x8d33E4Bd2516a96453b730016D6B09Cbc5e0d488","topics":["0xddf252ad1be2c89b69c2b068fc378daa952ba7f163c4a11628f55a4df523b3ef","0x0000000000000000000000007cb22cb3d8a58ade32f3bfc3e6a4ded1efaee080","0x000000000000000000000000fbfe02e82d22737ebbbadc1e07a47f6e3f226343"],"data":"0x0000000000000000000000000000000000000000000000004563918244f40000","blockNumber":7803,"transactionHash":"0x263890e247c3f57dde560c6faa29b116732722730b5f3b296394065c8a27a54e","transactionIndex":0,"blockHash":"0xd1c24f1a323454465c0ededd7a64b3ccbd46463bbae2fb5022471507a5bcb78c","logIndex":0,"removed":false,"id":"log_97902585"}],"logsBloom":"0x00000000000000000000000000000000000000000000000000000000000000000000000000400000000000000000000000000000000010000000000000000000000000000000000000000008000000000000000080000000000000000000000420000200000000000000000000000000000000000000000000000010000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000010000000000000000000080000000000000000000000000000000000000000000000000000000000001000","root":"0xb0de26fada4c6150c2b090ebadfcdf0801a67d4b5d52a9d4e03369bc1e2a0d23","to":"0x8d33e4bd2516a96453b730016d6b09cbc5e0d488","transactionHash":"0x263890e247c3f57dde560c6faa29b116732722730b5f3b296394065c8a27a54e","transactionIndex":0}}}