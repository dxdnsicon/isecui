module.exports = function(){
    
    process.env.NODE_ENV = 'production'
    var path = require('path')
    //这里要使用绝对路径。 指向项目根目录  shiningding
    const modulePath = path.join(__dirname+'../../../node_modules/');
    var ora = require(modulePath+'ora')
    var moment  = require(modulePath+'moment')
    var pretime = moment().format('X');
    console.log('\x1B[32m','start:'+pretime)
    console.log('\x1b[0m')
    require('./check-versions')()

    var rm = require(modulePath+'rimraf')
    var chalk = require(modulePath+'chalk')
    var webpack = require(modulePath+'webpack')
    var config = require(path.resolve(".")+'/config')
    var webpackConfig = require(resolve('build/webpack.prod.conf'))   //使用目标项目的conf 配置比较安全
    // var webpackConfig = require('./webpack.prod.conf')
    var rebuildConfig  =require('./webpack.rebuild.conf.js')(webpackConfig);

    var spinner = ora('building for production...')
    spinner.start()

    function resolve (dir) {
      return path.join(path.resolve("."),'', dir)
    }
    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
      if (err) throw err
      var rmTime = moment().format('X');
      console.log('\x1B[32m','rmTime:'+rmTime)
      console.log('\x1b[0m')
      webpack(rebuildConfig, function (err, stats) {
        spinner.stop()
        if (err) throw err
        process.stdout.write(stats.toString({
          colors: true,
          modules: false,
          children: false,
          chunks: false,
          chunkModules: false,
          startTime:false,
          endTime:false
        }) + '\n\n')

        if (stats.hasErrors()) {
          console.log(chalk.red('  Build failed with errors.\n'))
          process.exit(1)
        }
        var nexttime = moment().format('X');
        console.log(chalk.cyan('  Build complete.\n'))
        console.log('\x1B[32m','end:'+nexttime)    
        console.log('  Time consuming:'+(nexttime-pretime)+'s');
        console.log('\x1b[0m')
        console.log(chalk.yellow(
          '  Tip: built files are meant to be served over an HTTP server.\n' +
          '  Opening index.html over file:// won\'t work.\n'
        ))
      })
    })
}