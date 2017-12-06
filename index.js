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

    var actionName = req.body.result.action;
    var webhookReply = {};
    var text1 = "";
    var text2 = "";

    if (actionName === "input.welcome") {
        // parameters are stored in req.body.result.parameters
        var userName = req.body.result.parameters['user-name'];
        text1 += ":wave: Nice to meet you ";
        text1 += userName.toString();
        text1 += "/\nOnce again I am CoffeeMeBot.:robot_face:";
        text1 += "/\nPlease order your Coffee :coffee:";

        console.log("text1 : " + text1);
        console.log("text1.toString() : " + text1.toString());
        
        webhookReply = {
            "slack": {
                "text": text1,
                "attachments": [
                    {
                        "text": "You can also choose from here..",
                        "fallback": "You are unable to choose a coffee",
                        "callback_id": "wopr_coffee",
                        "color": "#724f0c",
                        "attachment_type": "default",
                        "actions": [
                            {
                                "name": "Coffee",
                                "text": "Caffe Americano",
                                "type": "button",
                                "value": "Caffe Americano"
                        },
                            {
                                "name": "Coffee",
                                "text": "Caffe Latte",
                                "type": "button",
                                "value": "Caffe Latte"
                        },
                            {
                                "name": "Coffee",
                                "text": "Cappuccino",
                                "type": "button",
                                "value": "Cappuccino"
                        },
                            {
                                "name": "Coffee",
                                "text": "Caffe Mocha",
                                "type": "button",
                                "value": "Caffe Mocha"
                        },
                            {
                                "name": "Coffee",
                                "text": "Brewed Coffee",
                                "type": "button",
                                "value": "Brewed Coffee"
                        },
                            {
                                "name": "Coffee",
                                "text": "Espresso",
                                "type": "button",
                                "value": "Espresso"
                        }
                    ]
                }
            ]
            }
        }

    } else if (actionName === "input.coffeeorder") {
        var coffee = req.body.result.parameters['Coffee'];
        var size = req.body.result.parameters['Size'];
        var dairy = req.body.result.parameters['Dairy'];
        var hotOrIced = req.body.result.parameters['Hot-or-Ice'];

        if (coffee && size && hotOrIced) {
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
