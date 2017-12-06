const express = require('express')
const bodyParser = require('body-parser')
const app = express()
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 5000))

const AUTH_TOKEN = 'an-example-token'

//export js files
var userManage = require('./userManage');
var serverValid = require('./serverValid');
var utilFunc = require('./utilFunction');

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
    console.log("## req.body ## \n%j", req.body)

    // Check authentication token
    serverValid.authCheck(req, AUTH_TOKEN)

    // Check request validation
    serverValid.valCheck(req);

    // the value of Action from api.ai is stored in req.body.result.action
    console.log('* Received action -- %s', req.body.result.action)

    var actionName = req.body.result.action;
    var userName = "David";
    var fileNm = userName + '.txt';
    var userType = userManage.checkUser(fileNm);
    
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
                            "text": "You can simply type or choose from here..",
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
        var coffee = req.body.result.contexts[0].parameters['Coffee'];
        var size = req.body.result.contexts[0].parameters['Size'];
        var dairy = req.body.result.contexts[0].parameters['Dairy'];
        var hotOrIced = req.body.result.contexts[0].parameters['Hot-or-Ice'];
        var inputTime = req.body.result.contexts[0].parameters['time']; 
        var today = new Date();
        var deliveryTime = "";
        
        if( inputTime === ""){
            deliveryTime = utilFunc.getTime(today);    
        }else{
            console.log("## InputTime : " + inputTime);
            deliveryTime = inputTime;
        }
        
        console.log("## coffee : " + coffee);
        console.log("## size : " + size);
        console.log("## hotOrIced : " + hotOrIced);
        console.log("## deliveryTime : " + deliveryTime);
        
        if (coffee && size && hotOrIced && deliveryTime) {
            console.log("## Mandatory field success!");
            //Coffee|Size|HotorIced|Dairy|DeliverTime|OrderDateTime|
            var data = coffee + ',' + size + ',' + hotOrIced + ',' + dairy + ',' + deliveryTime + ',' + today;
            
            //Create File
            fs.writeFileSync(fileNm, data);
            console.log("## FILE ["+fileNm+"] has been made."); console.log("## Read File ##\n"+fs.readFileSync(fileNm, 'utf8'));
        }
    } else{
        console.log("## Action not catched!! ##");
    }
    
    //console.log("## webhookReply : %j", webhookReply);
    
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
