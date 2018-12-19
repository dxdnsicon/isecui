module.exports = function(){
    var moment  = require('moment')
    var pretime = moment().format('X');
    console.log('\x1B[32m','start:'+pretime)
    console.log('\x1b[0m')
    require('./check-versions')()
    process.env.NODE_ENV = 'production'
    var path = require('path')
    var ora = require('ora')
    var rm = require('rimraf')
    var chalk = require('chalk')
    var webpack = require('webpack')
    var config = require(path.resolve(".")+'/config')

    //这里要使用绝对路径。 指向项目根目录  shiningding
    const modulePath = path.join(__dirname+'../../node_modules/');
    var webpackConfig = require(resolve('build/webpack.prod.conf'))

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