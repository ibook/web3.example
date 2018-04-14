
## Account 

### List

    % curl http://localhost:8000/api/account/list.json

    {"status":true,"code":0,"data":["0xB94054c174995AE2A9E7fcf6c7924635FBa8ECF7","0xf56b81a2bcb964D2806071e9Be4289A5559BB0fA","0x997e5CA600E19447D0B82aFBf9c7F00De2B39B16","0x538b392D57d867A57eE8Eed05737cB08B4691302","0xD5EEaE04932DbC2E65B948A76A6Cdfd44323A5Dd","0x73eA28ba674a1a207cC03e262C7092a8881Feec8"]}

### New Account

    % curl -XPOST -d 'password=123456' http://localhost:8000/api/account/new.json
    {"status":true,"code":0,"data":"0xbd38Cb8a53d1c051faF0F4E186f9ef2bBaEb308A"}

## Balance

### Ethereum balance

    % curl "http://localhost:8000/api/balance.json?address=0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff"
    {"status":true,"code":0,"data":{"account":"0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff","balance":"0"}}%

### Token balance

    curl "http://localhost:8000/api/balance/token.json?address=0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff"
    {"status":true,"code":0,"data":{"account":"0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff","balance":"100000000","name":"NEO"}}

##

### ETH

    % curl -XPOST -d 'from=0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff&to=0xa745D295d2E35B16b2F41da48D9883CcE3c609a7&amount=100&password=12345678' http://localhost:8000/api/transfer.json

    {"status":true,"code":0,"data":{"hash":"0x81ba2f2a79fb819c1cac544536e0a4df2d8417b64f3781299213a174a154d4de"}}% 

### Token

    % curl -XPOST -d 'from=0x8dA0bB9Ee3a7d85763d1B5320D8c0f859F0438ff&to=0xa745D295d2E35B16b2F41da48D9883CcE3c609a7&amount=100&password=12345678' http://localhost:8000/api/transfer/token.json
    
    {"status":true,"code":0,"data":{"hash":"0xd5de8c7623ece55d9857871a564cb156a2956a59f46ec0bdd201e7904dabc312"}}