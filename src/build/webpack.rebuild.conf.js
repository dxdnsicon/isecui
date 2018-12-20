//webpack配置劫持重写部分 配置，优化打包速度。
//这里要使用绝对路径。 指向项目根目录  shiningding
var path = require('path')
const os = require('os')
var moment  = require('moment')
var config = require(path.resolve(".")+'/config')
const modulePath = path.join(__dirname+'../../../node_modules/');
const HappyPack = require(modulePath+'happypack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })

//定义一个happypack 解析器
const happy = new HappyPack({
  id: 'happy-babel-js',
  loaders: [modulePath+'babel-loader?cacheDirectory=true'],
  threadPool: happyThreadPool,
})

const ugli = new ParallelUglifyPlugin({
  cacheDir: '.cache/',
  sourceMap: config.build.productionSourceMap,
  uglifyES:{
    output: {
      comments: false
    },
    compress: {
      warnings: false
    }
  }
})
// UglifyJsPlugin FasterUglifyPlugin

function checkHappyPack(list){
    var flg = [-1,-1];
    list.forEach(function(i,item){
        if(i.name=='HappyPack'){
            flg[0] = item;
        }
        // console.log(i['options'])
        if(i['options']&&(i['options']['uglifyOptions']||i['options']['uglifyJS'])){
            flg[1] = item;
        }
    })
    return flg;
}

function resolve (dir) {
  return path.join(path.resolve("."),'', dir)
}

function rebuildConfig(config){
    var rules = config.module.rules;
    var list = checkHappyPack(config.plugins);
    //如果配置没有用到happypack 则使用
    console.log(list)
    config.plugins.splice(list[1],1)
    config.plugins.push(ugli)
    if(list[0] == -1){
        config.plugins.push(happy)
        rules.forEach(function(i,item){
            //修改js的loader配置
            if(i.test.toString().indexOf('js')>-1){
                i.loader = 'happypack/loader?id=happy-babel-js'
                i.include=[resolve('src'), resolve('test'),resolve('node_modules/webpack-dev-server/client')]
            }
        })
    }
    var pretime = moment().format('X');
    console.log('\x1B[32m','rebuild:'+pretime)
    console.log('\x1b[0m')
    return config
}

module.exports = rebuildConfig