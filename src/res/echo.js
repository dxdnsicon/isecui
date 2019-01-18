var shelljs = require('shelljs/global');
function echo(str,num){
    if(!num){
        console.log(str)
    }else{
        for(let i=0;i<num;i++){
            console.log(str)
        }
    }
}
module.exports = echo