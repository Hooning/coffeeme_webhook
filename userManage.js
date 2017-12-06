var fs = require('fs');

//blocking the stream
//var readMe = fs.readFileSync('readMe.txt', 'utf8');
//fs.readFile('readMe.txt', 'utf8', function(err,data){
//    fs.writeFile('writeMe.txt', data);
//});
//console.log(readMe);
//fs.writeFileSync('writeMe.txt', readMe);


//export js files
module.exports = {
    checkUser: function(userName, fileNm){
       
        if( fs.existsSync(fileNm) ){
            console.log("## Existing User");
            return "oldUser";
        }else{
            console.log("## New User");
            return "newUser";
        }
                
    },
}