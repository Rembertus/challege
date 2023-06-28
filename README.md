<strong>Bankathon challenges</strong>

## Description

## CHALLENGE 1
“SISTEMA PARA AUTOMATIZAR ÓRDENES”  
Este desafío tiene por objetivo crear un sistema que permita a clientes del  
banco poder canalizar órdenes hacia diferentes plataformas de intercambio  
de criptomonedas para encontrar y ejecutar los mejores precios de compra y  
de venta.  

## CHALLENGE 2
Título “SISTEMA AUTOMATIZADO DE BALANCEO DE SALDOS”  
Towerbank opera como omnibus account para los clientes del banco frente a  
diferentes plataformas de intercambio, por lo que en base a las operaciones  
que se canalizan por medio del sistema automatizado de órdenes (desafío  
base) es necesario que exista el saldo correspondiente para operar en cada  
una de las plataformas de intercambio centralizadas y descentralizadas.  
En base a esto, es necesario crear un servicio que pueda mover los saldos de  
Towerbank entre diferentes plataformas para que siempre exista el disponible  
para canalizar las órdenes de los clientes.  

## Instructions
```javascript 
yarn install    // Para instalar todas las dependencias  
yarn start:dev  // Para levantar el servicio
```
## Test from Postman - Info
Test Info
GET http://localhost:3001/api/v1/bankathon/info
Result Body-Json
```javascript 
{
    "statusCode": 200,
    "message": "Data returned successfully.",
    "response": {
        "accountId": "6e9e7438-7f9e-45d0-a17f-a26c1bb05f3f",
        "balance": 1000,
        "errors": []
    }
} 
```
## Test from Postman - purchase
POST http://localhost:3001/api/v1/bankathon/purchase-sell
Body-Json
```javascript 
{
    "exchangeName": "binance",
    "amount": 100,
    "transactionType": "purchase",
    "cryptoCurrency": "bnb"         // Debería considerarse este campo, porque un exchange maneja varias criptomonedas
}
```
Result Body-Json
```javascript 
{
    "statusCode": 200,
    "message": "Transaction processed correctly",
    "response": {
        "accountId": "6e9e7438-7f9e-45d0-a17f-a26c1bb05f3f",
        "transferId": "074a5b36-be0d-4d28-a3d9-6b3c7ce9f459",
        "balance": 1100,
        "errors": []
    }
}
```
## Test from Postman - balancing-case-1
GET http://localhost:3001/api/v1/bankathon/balancing-case1  

# Data Test in BalancingService // descomentar
```javascript 
    balanceProviders[0].balance = 513000;
    balanceProviders[1].balance = 1026000;
    balanceProviders[2].balance = 769500;
    balanceProviders[3].balance = 256500;
```
```javascript 
{
    "statusCode": 200,
    "message": "Transaction processed correctly",
    "response": [
        {
            "from": "buda",
            "to": "kraken",
            "amount": 128250
        },
        {
            "from": "bitstamp",
            "to": "kraken",
            "amount": 256500
        },
        {
            "from": "bitstamp",
            "to": "binance",
            "amount": 128250
        }
    ]
}
```
## Test from Postman - balancing-case-2
GET http://localhost:3001/api/v1/bankathon/balancing-case2
Result Body-Json
```javascript 
{
    "statusCode": 200,
    "message": "Transaction processed correctly",
    "response": {
        "move": [
            {
                "from": "binance",
                "to": "buda",
                "amount": 13000
            },
            {
                "from": "kraken",
                "to": "buda",
                "amount": 126000
            }
        ],
        "BuySell": [
            {
                "name": "buda",
                "amount": 48000,
                "transactionType": "purchase"
            },
            {
                "name": "bitstamp",
                "amount": 87000,
                "transactionType": "purchase"
            }
        ]
    }
}
```


## For Support

- [Remberto Gonzales Cruz](regonzales@organojudicial.gob.bo)

## License
