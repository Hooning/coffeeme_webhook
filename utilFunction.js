function checkTime(i) {
  if (i < 10) {
    i = "0" + i;
  }
  return i;
}

//export js files
module.exports = {
    getTime: function(today){
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        
        var time = h + m + s;
        
        console.log("## System Time : " + time);
        
        return time;
    },
    getDateTime: function(today){
        var year = today.getFullYear();
        var month = today.getMonth();
        var day = today.getDay();
        var h = today.getHours();
        var m = today.getMinutes();
        var s = today.getSeconds();

        month = checkTime(month);
        day = checkTime(day);
        h = checkTime(h);
        m = checkTime(m);
        s = checkTime(s);
        
        var DateTime = year + month + day + h + m + s;
        
        return DateTime;
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
}