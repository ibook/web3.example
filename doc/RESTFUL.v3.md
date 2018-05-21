
## Account 

### List

	请求：GET
	地址： http://localhost:8000/api/account/list.json
	演示：
    neo@MacBook-Pro ~/ethereum/web3.example % curl http://localhost:8000/api/account/list.json

    {"status":true,"code":0,"data":{"accounts":["0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff","0xa745D295d2E35B16b2F41da48D9883CcE3c609a7","0x7cB22cb3d8a58ade32f3BfC3E6a4dEd1efAEe080","0x8efB99Ec55bCfBE2CFe47918f2d9E55FA732111f","0xc28Ec50bFeD8E4B88780e910a802dA8Fa347CCad","0xF0688330101d53BD0C6ede2Ef04d33c2010e9a5d","0xfbFe02E82d22737eBBBaDc1E07a47F6e3F226343"]}}

### New Account
	
	请求：POST
	发送数据： password=123456  
	地址：http://localhost:8000/api/account/new.json
	演示：
	
    neo@MacBook-Pro ~/ethereum/web3.example % curl -XPOST -d 'password=123456' http://localhost:8000/api/account/new.json
    {"status":true,"code":0,"data":{"account":"0xbd38Cb8a53d1c051faF0F4E186f9ef2bBaEb308A"}}

## Ethereum balance ETH

	请求：GET
	参数：address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
	地址：http://localhost:8000/api/balance.json
	演示：
	
    % curl "http://localhost:8000/api/balance.json?address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6"
    {"status":true,"code":0,"data":{"account":"0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6","balance":"0"}}%

## Transfer ETH

	请求：POST
	参数：
		from=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
		to=0xC41c6579ec90dA887FbbeE99db96f139A78f7E87
		amount=100
		password=12345678
	地址：
		http://localhost:8000/api/transfer.json
		
	演示：
	
    % curl -XPOST -d 'from=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6&to=0xC41c6579ec90dA887FbbeE99db96f139A78f7E87&amount=100&password=12345678' http://localhost:8000/api/transfer.json

    {"status":true,"code":0,"data":{"hash":"0x81ba2f2a79fb819c1cac544536e0a4df2d8417b64f3781299213a174a154d4de"}}% 




## Token

### Token balance

	请求：GET
	参数：address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
	地址：http://localhost:8000/api/balance/token.json
	演示：

    curl "http://localhost:8000/api/balance/token.json?address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6"
    {"status":true,"code":0,"data":{"account":"0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6","balance":"100000000","name":"NEO"}}

### Token transfer

	请求：POST
	参数：
		from=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6
		to=0xC41c6579ec90dA887FbbeE99db96f139A78f7E87
		amount=100
		password=12345678
	地址：
		http://localhost:8000/api/transfer/token.json
		
	演示：

    % curl -XPOST -d 'from=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6&to=0xC41c6579ec90dA887FbbeE99db96f139A78f7E87&amount=100&password=12345678' http://localhost:8000/api/transfer/token.json
    
    {"status":true,"code":0,"data":{"hash":"0xd5de8c7623ece55d9857871a564cb156a2956a59f46ec0bdd201e7904dabc312"}}
