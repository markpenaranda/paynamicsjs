const ParseString = require('xml2js').parseString;
const Crpyto = require('crypto');

class Paynamics {

  constructor(params) {
    this.merchant_id = params.merchant_id;
    this.merchant_key = params.merchant_key;
    this.notification = params.notification;
    this.response = params.response;
    this.cancel = params.cancel;
  }

  generateSignature(params) {
    const $_mid = this.merchant_id; //<-- your merchant id
    const $_requestid =  params.requestid;
    const $_ipaddress = params.ip || "";
    const $_noturl = this.notification; // url where response is posted
    const $_resurl = this.response; //url of merchant landing page
    const $_cancelurl = this.cancel; //url of merchant landing page
    const $_fname = params.firstName; // kindly set this to first name of the cutomer
    const $_mname = params.middleName || ""; // kindly set this to middle name of the cutomer
    const $_lname = params.lastName; // kindly set this to last name of the cutomer
    const $_addr1 = params.address1; // kindly set this to address1 of the cutomer
    const $_addr2 = params.address2;// kindly set this to address2 of the cutomer
    const $_city = params.city; // kindly set this to city of the cutomer
    const $_state = params.state; // kindly set this to state of the cutomer
    const $_country = params.country; // kindly set this to country of the cutomer
    const $_zip = params.zip; // kindly set this to zip/postal of the cutomer
    const $_sec3d = "try3d"; // 
    const $_email = params.email; // kindly set this to email of the cutomer
    const $_phone = params.phone; // kindly set this to phone number of the cutomer
    const $_mobile = params.mobile; // kindly set this to mobile number of the cutomer
    const $_clientip = params.clientip;
    const $_amount = params.amount; // kindly set this to the total amount of the transaction. Set the amount to 2 decimal point before generating signature.
    const $_currency = params.currency; //PHP or USD
    const $forSign = $_mid + $_requestid + $_ipaddress + $_noturl + $_resurl +  $_fname + $_lname + $_mname + $_addr1 + $_addr2 + $_city + $_state + $_country + $_zip + $_email + $_phone + $_clientip + $_amount + $_currency + $_sec3d;
    const $cert = this.merchant_key; //<-- your merchant key

    const $_sign = Crpyto.createHash('sha512').update($forSign + $cert).digest("hex");

    let xml = "";
    xml = xml + "<?xml version=\"1.0\" encoding=\"utf-8\" ?>";
    xml = xml + "<Request>";
    xml = xml + "<orders>";
    xml = xml + "<items>";
    xml = xml + "<Items>";
    xml = xml + params.items;
    xml = xml + "</Items>";
    xml = xml + "</items>";
    xml = xml + "</orders>";
    xml = xml + "<mid>" + $_mid + "</mid>";
    xml = xml + "<request_id>" + $_requestid + "</request_id>";
    xml = xml + "<ip_address>" + $_ipaddress + "</ip_address>";
    xml = xml + "<notification_url>" + $_noturl + "</notification_url>";
    xml = xml + "<response_url>" + $_resurl + "</response_url>";
    xml = xml + "<cancel_url>" + $_cancelurl + "</cancel_url>";
    xml = xml + "<mtac_url></mtac_url>"; // pls set this to the url where your terms and conditions are hosted
    xml = xml + "<descriptor_note>''</descriptor_note>"; // pls set this to the descriptor of the merchant ""
    xml = xml + "<fname>" + $_fname + "</fname>";
    xml = xml + "<lname>" + $_lname + "</lname>";
    xml = xml + "<mname>" + $_mname + "</mname>";
    xml = xml + "<address1>" + $_addr1 + "</address1>";
    xml = xml + "<address2>" + $_addr2 + "</address2>";
    xml = xml + "<city>" + $_city + "</city>";
    xml = xml + "<state>" + $_state + "</state>";
    xml = xml + "<country>" + $_country + "</country>";
    xml = xml + "<zip>" + $_zip + "</zip>";
    xml = xml + "<secure3d>" + $_sec3d + "</secure3d>";
    xml = xml + "<trxtype>sale</trxtype>";
    xml = xml + "<email>" + $_email + "</email>";
    xml = xml + "<phone>" + $_phone + "</phone>";
    xml = xml + "<mobile>" + $_mobile + "</mobile>";
    xml = xml + "<client_ip>" + $_clientip + "</client_ip>";
    xml = xml + "<amount>" + $_amount + "</amount>";
    xml = xml + "<currency>" + $_currency + "</currency>";
    xml = xml + "<mlogo_url></mlogo_url>";// pls set this to the url where your logo is hosted
    xml = xml + "<pmethod></pmethod>";
    xml = xml + "<signature>" + $_sign + "</signature>";
    xml = xml + "</Request>";

    const $b64string =  new Buffer(xml).toString('base64');
    return $b64string;

  }

  verifySignature(paymentresponse, cb) {
    const merchant_key = this.merchant_key
    let $body = paymentresponse;
    $body = $body.replace(/\s/g, "+");
    let $Decodebody = Buffer.from($body, 'base64');

    ParseString($Decodebody, function (err, result) {
      console.log(result)

      if(err) {
        return cb(true, null);
      }

      let $ServiceResponseWPF = result.ServiceResponseWPF;
      let $application = $ServiceResponseWPF.application[0];
      let $responseStatus = $ServiceResponseWPF.responseStatus[0];

      let $cert = merchant_key;

      let $forSign = $application.merchantid + $application.request_id + $application.response_id + $responseStatus.response_code + $responseStatus.response_message +
        $responseStatus.response_advise + $application.timestamp + $application.rebill_id + $cert;
      let $_sign = Crpyto.createHash('sha512').update($forSign).digest("hex");

      if($_sign == $ServiceResponseWPF.application[0].signature) {
        if ($responseStatus.response_code && $responseStatus.response_code[0] === 'GR001' || $responseStatus.response_code && $responseStatus.response_code[0] === 'GR002') {
          return cb(null, {
            success: true,
            requestid : $application.request_id && $application.request_id[0] ? $application.request_id[0] : null,
            paynamicsResponse: {
              merchantid: $application.merchantid && $application.merchantid[0] ? $application.merchantid[0] : null,
              request_id: $application.request_id && $application.request_id[0] ? $application.request_id[0] : null,
              response_id: $application.response_id && $application.response_id[0] ? $application.response_id[0] : null,
              response_code: $responseStatus.response_code && $responseStatus.response_code[0] ? $responseStatus.response_code[0] : null,
              response_message: $responseStatus.response_message && $responseStatus.response_message[0] ? $responseStatus.response_message[0] : null,
              response_advise: $responseStatus.response_advise && $responseStatus.response_advise[0] ? $responseStatus.response_advise[0] : null,
              timestamp: $application.timestamp && $application.timestamp[0] ? $application.timestamp[0] : null,
              rebill_id: $application.rebill_id && $application.rebill_id[0] ? $application.rebill_id[0] : null
            }
          });
        }
        return cb(true, null);
      }
      return cb(true, null);
    });
  }

}

module.exports = Paynamics;