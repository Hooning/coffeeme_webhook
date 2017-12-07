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
        var inTime = inputTime.replace(":","").replace(":","");
        console.log("## inputTime : " + inTime);
        
        var h = todate.getHours();
        var m = todate.getMinutes()+10;
        var s = todate.getSeconds();
        
        h = checkTime(h).toString();
        m = checkTime(m).toString();
        s = checkTime(s).toString();
        
        var curTime = h + m + s;
        
        console.log("## possibleTime : " + curTime + " after");

        if(inTime < curTime){
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
        
        var arr = dataList.length;
                
        return price;
    },
}