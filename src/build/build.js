module.exports = function() {
    process.env.NODE_ENV = 'production'
    var path = require('path')
        //这里要使用绝对路径。 指向项目根目录  shiningding
    const modulePath = path.join(__dirname + '../../../node_modules/');
    var ora = require(modulePath + 'ora')
    var moment = require(modulePath + 'moment')
    require('./check-versions')()
    var rm = require(modulePath + 'rimraf')
    var chalk = require(modulePath + 'chalk')
    var webpack = require(modulePath + 'webpack')

    //some info;
    console.log(chalk.yellow('Webpack4.0 common build tool for vue-cli'));
    console.log(chalk.yellow('Auther by shiningding@tencent.com 2019/01/18'));
    console.log(chalk.yellow('isecui build  .......'));
    console.log(chalk.yellow('webpack version:' + webpack.version))
    var pretime = moment().format('X');
    console.log(chalk.green('start:' + pretime))

    //rebuild webpack4.0 config;
    var config = require(path.resolve(".") + '/config')
    var webpackConfig = require(resolve('build/webpack.prod.conf')) //使用目标项目的conf 配置比较安全
    var rebuildConfig = require('./webpack.rebuild.conf.js')(webpackConfig);

    var spinner = ora('building for production...')
    spinner.start()

    function resolve(dir) {
        return path.join(path.resolve("."), '', dir)
    }
    rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
        if (err) throw err
        var rmTime = moment().format('X');
        console.log(chalk.green('rmTime:' + rmTime))
        webpack(rebuildConfig, function(err, stats) {
            spinner.stop()
            if (err) throw err
            process.stdout.write(stats.toString({
                colors: true,
                modules: false,
                children: false,
                chunks: false,
                chunkModules: false,
                startTime: false,
                endTime: false
            }) + '\n\n')

            if (stats.hasErrors()) {
                console.log(chalk.red('  Build failed with errors.\n'))
                process.exit(1)
            }
            var nexttime = moment().format('X');
            console.log(chalk.cyan('  Build complete.\n'))
            console.log(chalk.green('end:' + nexttime))
            console.log(chalk.green('Time consuming:' + (nexttime - pretime) + 's'))
            console.log(chalk.yellow(
                '  Tip: built files are meant to be served over an HTTP server.\n' +
                '  Opening index.html over file:// won\'t work.\n'
            ))
        })
    })
}