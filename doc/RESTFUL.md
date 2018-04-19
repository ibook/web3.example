
## Account 

### List

	GET 请求地址 http://localhost:8000/api/account/list.json

    % curl http://localhost:8000/api/account/list.json

    {"status":true,"code":0,"data":["0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7","0xf56b81a2bcb964D2806071e9Be4289A5559BB0fA","0x997e5CA600E19447D0B82aFBf9c7F00De2B39B16","0x538b392D57d867A57eE8Eed05737cB08B4691302","0xD5EEaE04932DbC2E65B948A76A6Cdfd44323A5Dd","0x73eA28ba674a1a207cC03e262C7092a8881Feec8"]}

### New Account
	
	请求：POST
	发送数据： password=123456  
	地址：http://localhost:8000/api/account/new.json
	演示：
	
    % curl -XPOST -d 'password=123456' http://localhost:8000/api/account/new.json
    {"status":true,"code":0,"data":"0xbd38Cb8a53d1c051faF0F4E186f9ef2bBaEb308A"}

## Balance

### Ethereum balance

    % curl "http://localhost:8000/api/balance.json?address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6"
    {"status":true,"code":0,"data":{"account":"0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6","balance":"0"}}%

### Token balance

    curl "http://localhost:8000/api/balance/token.json?address=0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6"
    {"status":true,"code":0,"data":{"account":"0x3FBB5e96c9a643450B0e76c5c2122048FC733fC6","balance":"100000000","name":"NEO"}}

## Transfer

### ETH

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

### Token

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
