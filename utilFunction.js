//make files
var fs = require('fs');

function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//export js files
module.exports = {
    getDirectDeliveryTime: function(){
        var today = new Date();
        //Change to UTC+1
        today.setHours(today.getHours()+1);
        
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
    getDateTime: function(todate){
        console.log("## System todate : " + todate);
        
        var year = todate.getFullYear();
        var month = todate.getMonth()+1;
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
    checkTime: function(inputTime, todate){
        console.log("## inputTime : " + inputTime);
        
        var h = todate.getHours();
        var m = todate.getMinutes()+10;
        var s = todate.getSeconds();
        
        h = checkTime(h).toString();
        m = checkTime(m).toString();
        s = checkTime(s).toString();
        
        var curTime = h + m + s;
        
        console.log("## possibleTime : " + curTime + " after");

        if(inputTime < curTime){
            return false;
        }else{
            return true;
        }

    },
    getPrice: function(coffee,size){
        var price = 0.00;
        
        switch (coffee){
            case "Caffe Americano":
                switch (size){
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
                switch (size){
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
                switch (size){
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
                switch (size){
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
                switch (size){
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
    getDataArray: function(fileNm){
        var dataList = fs.readFileSync(fileNm, 'utf8');
        var remainCnt = 0;
        var rowDataArr = dataList.split('\n');
        var validDataArr = [];
        var webhookReply = {};
        
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
        
        //do not count last one
        var rowLength = rowDataArr.length-1;
        
        for( var i = 0; i < rowLength; i++){
            
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
            
            if( dairy !== ""){
                if( coffee === "Caffe Americano" || coffee === "Brewed Coffee"){
                   dairy = "";    
                }else{
                   dairy = "with normal milk";
                }
                
            }else{
                dairy = "with " + dairy;
            }
            
            var h = deliveryTime.substring(0,2);
            var m = deliveryTime.substring(2,4);
            var s = deliveryTime.substring(4,6);
                                           
            var delvTime = h+":"+m+":"+s;
            
            if( orderStatus === "1"){
                remainCnt++;
                validDataArr = rowDataArr[i];
                
                webhookReply = {
                    "slack": {
                        "text": "Here is your order status..",
                        "attachments": [
                            {
                                "text": "You have an order of "+size+" size \n" +hotOrIced+" "+coffee+dairy+"\nIt will be delivered around "+ delvTime,
                                "fallback": "Something is wrong with time.",
                                "callback_id": "wopr_time",
                                "color": "#724f0c",
                                "attachment_type": "default"
                            }
                        ]
                    }
                }
            }
        }
        console.log("##rowLength : " + rowLength);
        console.log("##remainCnt : " + remainCnt);
        console.log("##validDataArr : " + validDataArr);
                
        return webhookReply;
    },
}