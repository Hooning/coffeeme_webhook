//make files
var fs = require('fs');

//export js files
var utilFunc = require('./utilFunction');

function checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    return i;
}

//export js files
module.exports = {
        getDirectDeliveryTime: function () {
            var today = new Date();
            //Change to UTC+1
            today.setHours(today.getHours() + 1);

            today.setMinutes(today.getMinutes() + 10);
            console.log("## UTC Time +10min : " + today);

            var h = today.getHours();
            var m = today.getMinutes();
            var s = today.getSeconds();

            h = checkTime(h).toString();
            m = checkTime(m).toString();
            s = checkTime(s).toString();

            var time = h + m + s;

            console.log("## Direct Delivery Time : " + time);

            return time;
        },
        getDateTime: function (todate) {
            console.log("## System todate : " + todate);

            var year = todate.getFullYear();
            var month = todate.getMonth() + 1;
            var day = todate.getDate();
            var h = todate.getHours();
            var m = todate.getMinutes();
            var s = todate.getSeconds();

            console.log("## year : " + year);
            console.log("## month : " + month);
            console.log("## day : " + day);
            console.log("## h : " + h);
            console.log("## m : " + m);
            console.log("## s : " + s);

            month = checkTime(month).toString();
            day = checkTime(day).toString();
            h = checkTime(h).toString();
            m = checkTime(m).toString();
            s = checkTime(s).toString();

            var DateTime = year + month + day + h + m + s;

            return DateTime;
        },
        checkTime: function (inputTime, todate) {
            console.log("## inputTime : " + inputTime);
            
            var h = inputTime.substring(0,2);
            var m = inputTime.substring(2,4);
            var s = inputTime.substring(4,6);
            
            var delivDate = new Date();
            delivDate.setHours(h);
            delivDate.setMinutes(m);
            delivDate.setSeconds(s);
//            var h = todate.getHours();
//            var m = todate.getMinutes() + 10;
//            var s = todate.getSeconds();
            todate.setMinutes(todate.getMinutes()+10);

            console.log("## inputDelivDate : " + delivDate);
            console.log("## possibleDate : " + todate );
            console.log("## inputDelivTime : " + delivDate.getTime());
            console.log("## possibleTime : " + todate.getTime() );

            if (delivDate < todate) {
                return false;
            } else {
                return true;
            }

        },
        getPrice: function (coffee, size) {
            var price = 0.00;

            switch (coffee) {
                case "Caffe Americano":
                    switch (size) {
                        case "Short":
                            price = 0.80;
                            break;
                        case "Tall":
                            price = 1.00;
                            break;
                        case "Grande":
                            price = 1.20;
                            break;
                        case "Venti":
                            price = 1.40;
                            break;
                    }
                    break;
                case "Caffe Latte":
                    switch (size) {
                        case "Short":
                            price = 1.00;
                            break;
                        case "Tall":
                            price = 1.20;
                            break;
                        case "Grande":
                            price = 1.40;
                            break;
                        case "Venti":
                            price = 1.60;
                            break;
                    }
                    break;
                case "Cappuccino":
                    switch (size) {
                        case "Short":
                            price = 1.00;
                            break;
                        case "Tall":
                            price = 1.20;
                            break;
                        case "Grande":
                            price = 1.40;
                            break;
                        case "Venti":
                            price = 1.60;
                            break;
                    }
                    break;
                case "Caffe Mocha":
                    switch (size) {
                        case "Short":
                            price = 1.20;
                            break;
                        case "Tall":
                            price = 1.40;
                            break;
                        case "Grande":
                            price = 1.60;
                            break;
                        case "Venti":
                            price = 1.80;
                            break;
                    }
                    break;
                case "Brewed Coffee":
                    switch (size) {
                        case "Short":
                            price = 0.70;
                            break;
                        case "Tall":
                            price = 0.90;
                            break;
                        case "Grande":
                            price = 1.10;
                            break;
                        case "Venti":
                            price = 1.30;
                            break;
                    }
                    break;
            }

            return price;
        },
        getDataArray: function (fileNm, action) {
            var dataList = fs.readFileSync(fileNm, 'utf8');
            var remainCnt = 0;
            var rowDataArr = dataList.split('\n');
            var validDataArr = [];
            var webhookReply = {};
            
            console.log("#### File Data ####\n" + dataList);

            //do not count last one
            var rowLength = rowDataArr.length - 1;
            
            for (var i = 0; i < rowLength; i++) {
                var userName = "";
                var orderDateTime = "";
                var orderStatus = "";
                var coffee = "";
                var size = "";
                var hotOrIced = "";
                var dairy = "";
                var deliveryTime = "";
                var scheduleYn = "";
                var price = "";                
                
                var rowData = rowDataArr[i].split(",");
                //userName|orderDateTime|orderStatus|coffee|size|hotOrIced|dairy|deliveryTime|scheduleYn|price
                userName = rowData[0];
                orderDateTime = rowData[1];
                orderStatus = rowData[2];
                coffee = rowData[3];
                size = rowData[4];
                hotOrIced = rowData[5];
                dairy = rowData[6];
                deliveryTime = rowData[7];
                scheduleYn = rowData[8];
                price = rowData[9];

                if (dairy === "") {
                    if (coffee === "Caffe Americano" || coffee === "Brewed Coffee") {
                        dairy = ".";
                    } else {
                        dairy = " with normal milk.";
                    }

                } else {
                    dairy = " with " + dairy + ".";
                }

                var h = deliveryTime.substring(0, 2);
                var m = deliveryTime.substring(2, 4);
                var s = deliveryTime.substring(4, 6);

                var delvTime = h + ":" + m + ":" + s;

                if (orderStatus === "1") {
                    remainCnt++;
                    validDataArr = rowDataArr[i];

                    if (action === "input.orderstatus") {
                        webhookReply = {
                            "slack": {
                                "text": "Here is your *order status*..",
                                "attachments": [
                                    {
                                        "text": "You have an order of " + size + " size \n" + hotOrIced + " " + coffee + dairy + "\nIt will be delivered around " + delvTime,
                                        "fallback": "Something is wrong with time.",
                                        "callback_id": "wopr_time",
                                        "color": "#724f0c",
                                        "attachment_type": "default",
                                        "actions": [
                                            {
                                                "name": "Cancel Order",
                                                "text": "Cancel Order",
                                                "type": "button",
                                                "value": "Cancel Order"
                                            },
                                            {
                                                "name": "Okey",
                                                "text": "OK",
                                                "type": "button",
                                                "value": "okey"
                                            }
                                        ]
                                    }
                                ]
                            }
                        }
                        //if there is something to cancel
                    } else if(action === "input.cancelcheck") {
                        
                        var inputTime = deliveryTime;
                        var cancelBool = false;
                        console.log("## cancel_inputTime : " + inputTime);
                        
                        var dHour = inputTime.substr(0,2);
                        var dMin = inputTime.substr(2,2);
                        var dSec = inputTime.substr(4,2);
                        
                        var delivDate = new Date();
                        delivDate.setHours(dHour);
                        delivDate.setMinutes(dMin);
                        delivDate.setSeconds(dSec);

                        var todate = new Date();
                        todate.setHours(todate.getHours() + 1);

                        var remainSec = (delivDate.getTime() - todate.getTime()) / 1000;
                        
                        console.log("## cancelCheck remain time " + remainSec );
                                    
                        
                        if (remainSec < 600) {
                            cancelBool = false;
                        } else {
                            cancelBool = true;
                        }
                        
                        if ( cancelBool ) {
                            webhookReply = {
                                "slack": {
                                    "text": "",
                                    "attachments": [
                                        {
                                            "text": "You have an order of " + size + " size \n" + hotOrIced + " " + coffee + dairy + "\nWhich will be delivered around " + delvTime + "\nAre you sure you want to cancel this order?",
                                            "fallback": "Something is wrong with time.",
                                            "callback_id": "wopr_time",
                                            "color": "#b72110",
                                            "attachment_type": "default",
                                            "actions": [
                                                {
                                                    "name": "Yes",
                                                    "text": "Yes",
                                                    "type": "button",
                                                    "value": "Yes"
                                                },
                                                {
                                                    "name": "No",
                                                    "text": "No",
                                                    "type": "button",
                                                    "value": "No"
                                                }
                                            ]
                                        }
                                    ]
                                }
                              }
                            } else {
                                webhookReply = {
                                    "slack": {
                                        "text": "",
                                        "attachments": [
                                            {
                                                "text": "Sorry, you are too late to cancel your order.\n( need more than 10 minutes to cancel.)",
                                                "fallback": "Something is wrong with cancel.",
                                                "callback_id": "wopr_cancel",
                                                "color": "#b72110",
                                                "attachment_type": "default"
                                            }
                                        ]
                                    }
                                }

                            }

                    }else{
                        console.log("## Alread have order !!");
                        webhookReply = {
                            "slack": {
                                        "text": "",
                                        "attachments": [
                                            {
                                                "text": "Sorry, you already have ongoing order. :wink:",
                                                "fallback": "Something is wrong with order.",
                                                "callback_id": "wopr_cannotorder",
                                                "color": "#b72110",
                                                "attachment_type": "default"
                                            }
                                        ]
                                    }    
                        }
                    }
                }
                
            }
            console.log("##rowLength : " + rowLength);
            console.log("##remainCnt : " + remainCnt);
            console.log("##validDataArr : " + validDataArr);

            if ( remainCnt === 0 ){
                if(action === "input.cancelcheck"){
                    webhookReply = {
                      "slack": {
                        "text": "",
                        "attachments": [
                          {
                            "text": "Currently, there is no order to be canceled. :sweat_smile:\nFirst, make your coffee :coffee: order.",
                            "fallback": "Something is wrong with cancel.",
                            "callback_id": "wopr_cancel",
                            "color": "#b72110",
                            "attachment_type": "default"
                          }
                        ]
                      }
                    }
                }else{
                    webhookReply = {
                      "slack": {
                        "text": "",
                        "attachments": [
                          {
                            "text": "Currently, there is no order to be delivered. :cold_sweat:\nFirst, make your coffee :coffee: order.",
                            "fallback": "Something is wrong with cancel.",
                            "callback_id": "wopr_cancel",
                            "color": "#b72110",
                            "attachment_type": "default"
                          }
                        ]
                      }
                    }
                }
            }
                
            
            return webhookReply;
        },
        cancelOrder: function (fileNm) {
            var dataList = fs.readFileSync(fileNm, 'utf8');
            var remainCnt = 0;
            var rowDataArr = dataList.split('\n');
            var validDataArr = [];
            var newDataArr = [];
            var webhookReply = {};
            
            //do not count last one
            var rowLength = rowDataArr.length - 1;
            
            fs.writeFileSync(fileNm, newDataArr);
            
            for (var i = 0; i < rowLength; i++) {
                var userName = "";
                var orderDateTime = "";
                var orderStatus = "";
                var coffee = "";
                var size = "";
                var hotOrIced = "";
                var dairy = "";
                var deliveryTime = "";
                var scheduleYn = "";
                var price = "";
                var updatedLine = "";

                var rowData = rowDataArr[i].split(",");
                //userName|orderDateTime|orderStatus|coffee|size|hotOrIced|dairy|deliveryTime|scheduleYn|price
                userName = rowData[0];
                orderDateTime = rowData[1];
                orderStatus = rowData[2];
                coffee = rowData[3];
                size = rowData[4];
                hotOrIced = rowData[5];
                dairy = rowData[6];
                deliveryTime = rowData[7];
                scheduleYn = rowData[8];
                price = rowData[9];
                
                if (orderStatus === "1") {
                    
                    //cancel order validation start
                    var inputTime = deliveryTime;
                    var cancelBool = false;
                    console.log("## cancel_inputTime : " + inputTime);

                    var dHour = inputTime.substr(0,2);
                    var dMin = inputTime.substr(2,2);
                    var dSec = inputTime.substr(4,2);

                    var delivDate = new Date();
                    delivDate.setHours(dHour);
                    delivDate.setMinutes(dMin);
                    delivDate.setSeconds(dSec);

                    var todate = new Date();
                    todate.setHours(todate.getHours() + 1);

                    var remainSec = (delivDate.getTime() - todate.getTime()) / 1000;

                    console.log("## CancelOrder() Remain time " + remainSec );


                    if (remainSec < 600) {
                        cancelBool = true;
                    } else {
                        cancelBool = false;
                    }
                    
                    if (cancelBool){
                        webhookReply = {
                            "slack": {
                                "text": "",
                                "attachments": [
                                    {
                                        "text": "Sorry, you are too late to cancel your order.\n( need more than 10 minutes to cancel.)",
                                        "fallback": "Something is wrong with cancel.",
                                        "callback_id": "wopr_cancel",
                                        "color": "#b72110",
                                        "attachment_type": "default"
                                    }
                                ]
                            }
                        }
                        
                        return webhookReply;
                    }
                    //cancel order validation end
                                        
                    var cancelStatus = "3";
                    
                    updatedLine =  userName+","+orderDateTime+","+cancelStatus+","+coffee+","+size+","+hotOrIced+","+dairy+","+deliveryTime+","+scheduleYn+","+price+"\n";
                    
                }else{
                    updatedLine =  userName+","+orderDateTime+","+orderStatus+","+coffee+","+size+","+hotOrIced+","+dairy+","+deliveryTime+","+scheduleYn+","+price+"\n";
                    
                }
                
                fs.appendFileSync(fileNm, updatedLine, function(err){
                    if(err) throw err;
                    console.log("## row["+i+"] appended!!");
                });
                
            }
            
            webhookReply = {
                        "slack": {
                            "text": "",
                            "attachments": [
                                        {
                                            "text": "Your order has been canceled. :ghost:",
                                            "fallback": "Something is wrong with cancel.",
                                            "callback_id": "wopr_cancel",
                                            "color": "#b72110",
                                            "attachment_type": "default" 
                                        }
                                    ]
                        }
                    }
                
            console.log("##rowLength : " + rowLength);
            console.log("##changed file : " + fs.readFileSync(fileNm, 'utf8'));

            return webhookReply;
        }
}
