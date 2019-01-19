# Paynamics - [https://www.paynamics.com/](https://www.paynamics.com/)

Paynamics Gateway intergration for NodeJS

## Installation

NPM
```
npm install paynamicsjs --save
```
YARN
```
yarn add paynamicsjs
```

## Usage
```
const PN = require('paynamicsjs');

const paynamics = new PN({
  merchant_id: "your merchant id", // set this as your merchant id
  merchant_key: "your merchant key", // set this as your merchant key
  notification: "https://yourapi.com/notification", // POST url from paynamics
  response: "https://yourapi.com/response", // GET url for transaction result
  cancel: "https://yourapi.com/cancel" // GET url when the user cancels
})

paynamics.verifySignature(payload, (e, r) => {
  console.log(e)
  console.log(r)
})
```