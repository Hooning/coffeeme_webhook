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
        
        var time = h + ":" + m + ":" + s;
        
        console.log("## System Time : " + time);
        
        return time;
    },
}