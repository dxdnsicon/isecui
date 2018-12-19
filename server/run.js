const shelljs  = require('shelljs/global');
var path = require('path')
const modulePath = path.join(__dirname+'../../node_modules/');
function resolve (dir) {
  return path.join(path.resolve("."),'', dir)
}
module.exports = function(){
    var str = 'node "'+path.join(modulePath+'/webpack-dev-server/bin/webpack-dev-server.js')+'" --inline --progress --config '+resolve('build/webpack.dev.conf.js');
    console.log(str)
    exec(str)
}