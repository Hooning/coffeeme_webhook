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

        if (userType === "newUser") {
            greetings += "Nice to meet you ";
            greetings += userName.toString();
            greetings += ":wave: \nPlease order your Coffee :coffee:";
        } else {
            greetings += "Welcome back ";
            greetings += userName.toString();
            greetings += ":sunglasses:\nWhich coffee is in your mind?"
        }

        greetings = greetings.toString();

        var webhookReply = {
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
        var coffee = req.body.result.contexts[1].parameters['Coffee'];
        var size = req.body.result.contexts[1].parameters['Size'];
        var dairy = req.body.result.contexts[1].parameters['Dairy'];
        var hotOrIced = req.body.result.contexts[1].parameters['Hot-or-Ice'];
        var inputTime = req.body.result.contexts[1].parameters['time'];
        var today = new Date();

        //Change to UTC+1
        today.setHours(today.getHours() + 1);

        //input time remove ':'
        inputTime = inputTime.replace(":","").replace(":","");
        
        console.log("## UTC Time : " + today);

        var deliveryTime = "";
        var orderDateTime = "";
        //[1]: in order, [2]: ordered, [3]: canceled 
        var orderStatus = "1"; //new order set
        var scheduleYn = "N";

        console.log("## coffee : " + coffee);
        console.log("## size : " + size);

        var price = utilFunc.getPrice(coffee, size);

        console.log("## price : " + price);

        if (inputTime === "") {
            scheduleYn = "N";
            deliveryTime = utilFunc.getDirectDeliveryTime();
        } else {
            console.log("## InputTime : " + inputTime);
            scheduleYn = "Y";
            deliveryTime = inputTime;

            if (utilFunc.checkTime(inputTime, today)) {
                console.log("## Time order okey");
            } else {
                console.log("## Time order wrong");
                webhookReply = {
                    "slack": {
                        "text": "",
                        "attachments": [
                            {
                                "text": "You can only schedule for future time (more than 10 minutes) today!\nPlease give me another time.",
                                "fallback": "Something is wrong with time.",
                                "callback_id": "wopr_time",
                                "color": "#b72110",
                                "attachment_type": "default"
                            }
                        ]
                    }
                }
            }

        }

        orderDateTime = utilFunc.getDateTime(today);

        console.log("## input_orderDateTime : " + orderDateTime);
        console.log("## input_orderStatus : " + orderStatus);
        console.log("## input_hotOrIced : " + hotOrIced);
        console.log("## input_dairy : " + dairy);
        console.log("## input_scheduleYn : " + scheduleYn);
        console.log("## input_deliveryTime : " + deliveryTime);

        if (coffee && size && hotOrIced && orderDateTime && deliveryTime) {
            console.log("## Mandatory field success!");
            //userName|orderDateTime|orderStatus|coffee|size|hotOrIced|dairy|deliveryTime|scheduleYn|price
            var data = userName + ',' + orderDateTime + ',' + orderStatus + ',' + coffee + ',' + size + ',' + hotOrIced + ',' + dairy + ',' + deliveryTime + ',' + scheduleYn + ',' + price + '\n';

            //Create File
            if(userType === 'newUser'){
                fs.writeFileSync(fileNm, data);
                console.log("## FILE [" + fileNm + "] has been made.");
            }else{
                fs.appendFileSync(fileNm, data, function(err){
                    if(err) throw err;
                    console.log("## "+fileNm+" Updated!!");
                });
            }
                        
            console.log("## Read File ##\n" + fs.readFileSync(fileNm, 'utf8'));
        }
    } else if(actionName === "input.orderstatus" && userName !== "" && userType ==="oldUser"){
        console.log("## input.orderstatus Action with user-name ##");
        //set split string to array
        utilFunc.getDataArray(fileNm);
               
        
    }else {
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
