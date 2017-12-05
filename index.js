const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const REQUIRE_AUTH = true
const AUTH_TOKEN = 'an-example-token'

//make files
var fs = require('fs');

//blocking the stream
//var readMe = fs.readFileSync('readMe.txt', 'utf8');
//fs.readFile('readMe.txt', 'utf8', function(err,data){
//    fs.writeFile('writeMe.txt', data);
//});
//console.log(readMe);
//fs.writeFileSync('writeMe.txt', readMe);

app.get('/', function (req, res) {
  res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
  res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
  // we expect to receive JSON data from api.ai here.
  // the payload is stored on req.body
  console.log(req.body)
  
  // we have a simple authentication
  if (REQUIRE_AUTH) {
    if (req.headers['auth-token'] !== AUTH_TOKEN) {
      return res.status(401).send('Unauthorized')
    }
  }

  // and some validation too
  if (!req.body || !req.body.result || !req.body.result.parameters) {
    return res.status(400).send('Bad Request')
  }

  // the value of Action from api.ai is stored in req.body.result.action
  console.log('* Received action -- %s', req.body.result.action)

  var intentName = req.body.result.metadata.intentName;
  var webhookReply = "";
    
  if ( intentName === "Order Welcome"){
    // parameters are stored in req.body.result.parameters
    var userName = req.body.result.parameters['given-name'];
    webhookReply = ':wave: ' + userName + ' I am CoffeeMeBot.:coffee: :smiley: :robot_face:\n'+
                   'Please order your Coffee';    
  }else if ( intentName === "Coffee Order"){
    var coffee = req.body.result.parameters['Coffee'];
    var size = req.body.result.parameters['Size'];
    var dairy = req.body.result.parameters['Dairy'];
    var hotOrIced = req.body.result.parameters['Hot-or-Ice'];
      
    if( coffee && size && hotOrIced){
        var datetime = new Date();
        var data = coffee + ',' + size + ',' + hotOrIced + ',' + dairy + ',' + datetime;
        fs.writeFileSync('orderFile.txt', data);
        console.log(fs.readFileSync('orderFile.txt', 'utf8'));
    }
  }
  

  // the most basic response
  res.status(200).json({
    source: 'webhook',
    speech: webhookReply,
    displayText: webhookReply
  })
})

app.listen(app.get('port'), function () {
  console.log('* Webhook service is listening on port:' + app.get('port'))
})
