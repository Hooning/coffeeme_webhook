const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const AUTH_TOKEN = 'an-example-token'

//export js files
var userManage = require('./userManage');
var serverValid = require('./serverValid');

//make files
var fs = require('fs');

app.get('/', function (req, res) {
    res.send('Use the /webhook endpoint.')
})
app.get('/webhook', function (req, res) {
    res.send('You must POST your request')
})

app.post('/webhook', function (req, res) {
    // we expect to receive JSON data from api.ai here.
    // the payload is stored on req.body
    console.log("## req.body ##\n" + req.body)

    // Check authentication token
    serverValid.authCheck(AUTH_TOKEN)

    // Check request validation
    serverValid.valCheck(req);

    // the value of Action from api.ai is stored in req.body.result.action
    console.log('* Received action -- %s', req.body.result.action)

    var actionName = req.body.result.action;
    var userName = req.body.result.parameters['user-name']; 
    var fileNm = userName + '.txt';
    var userType = userManage.checkUser(userName, fileNm);
    
    var greetings = "";

    if (actionName === "input.welcome" && userName !== "") {
        console.log("## input.welcome Action in with user-name ##")
        // parameters are stored in req.body.result.parameters
        
        if( userType === "newUser"){
            greetings += "Nice to meet you ";
            greetings += userName.toString();
            greetings += ":wave: \nPlease order your Coffee :coffee:";    
        }else{
            greetings += "Welcome back ";
            greetings += userName.toString();
            greetings += ":sunglasses:\nWhich coffee is in your mind?"
        }
        
        greetings = greetings.toString();
          
        var webhookReply = 
            {
                "slack": {
                    "text": greetings,
                    "attachments": [
                        {
                            "text": "You can simply type \n or \nchoose from here..",
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
        
    } else if (actionName === "input.orderdone") {
        var coffee = req.body.result.parameters['Coffee'];
        var size = req.body.result.parameters['Size'];
        var dairy = req.body.result.parameters['Dairy'];
        var hotOrIced = req.body.result.parameters['Hot-or-Ice'];
        var deliveryTime = req.body.result.parameter['time']; 

        if (coffee && size && hotOrIced && deliveryTime) {
            var datetime = new Date();
            //Coffee|Size|HotorIced|Dairy|DeliverTime|OrderDateTime|
            var data = coffee + ',' + size + ',' + hotOrIced + ',' + dairy + ',' + deliveryTime + ',' + datetime;
            
            //Create File
            fs.writeFileSync(fileNm, data);
            console.log(fs.readFileSync(fileNm, 'utf8'));
        }
    } else{
        console.log("## Action not catched!! ##");
    }
    
    console.log("## webhookReply : %j", webhookReply);
    
    // the most basic response
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json({
        source: 'webhook',
        data: webhookReply,
        speech: "",
        displayText: ""
    })
})

app.listen(app.get('port'), function () {
    console.log('* Webhook service is listening on port:' + app.get('port'))
})
