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

### Generate payment signature
```
const PN = require('paynamicsjs');

const paynamics = new PN({
  merchant_id: "your merchant id", // set this as your merchant id
  merchant_key: "your merchant key", // set this as your merchant key
  notification: "https://yourapi.com/notification", // POST url from paynamics
  response: "https://yourapi.com/response", // GET url for transaction result
  cancel: "https://yourapi.com/cancel" // GET url when the user cancels
})

const paymentSignature = paynamics.generateSignature({
  requestid: '', // order id for your app
  ip: '', // ip
  firstName: '', // customer's firstname
  middleName: '', // customer's middlename
  lastName: '', // customer's lastname
  address1: '', // customer's address1
  address2: '', // customer's address2
  city: '',
  state: '',
  country: '',
  zip: '',
  email: '',
  phone: '',
  mobile: '',
  clientip: '',
  amount: '', // set it to 2 decimal places
  currency: '', // PHP
})
```

```
serve this html to your customer and it will be routed to paynamics' web page payment.
notice that the value of the form is the string from generateSignature function above..

<form id="paynamics-form" name="form1" method="post" hidden action="https://testpti.payserv.net/webpaymentv2/default.aspx">
  <input type="text" name="paymentrequest" id="paymentrequest" value="paymentSignature" >
  <input type="submit">
</form>
<script>
  $(function () {
    window.onload = function(){
      $("#paynamics-form").submit();
    }
  })
</script>
```

```
after the user succesfully entered the card details, 
paynamics api will POST request to your web api. (notification url)
the body request will be paymentresponse variable.


paynamics.verifySignature(paymentresponse, (e, r) => {
  if(e) {
    // invalid signature
  } else {
    // success signature update the order status for your app.
  }
})
```