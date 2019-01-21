//webpack配置劫持重写部分 配置，优化打包速度。
//这里要使用绝对路径。 指向项目根目录  shiningding
var path = require('path')
const os = require('os')
var moment = require('moment')
var config = require(path.resolve(".") + '/config')
const modulePath = path.join(__dirname + '../../../node_modules/');
const HappyPack = require(modulePath + 'happypack')
const ParallelUglifyPlugin = require('webpack-parallel-uglify-plugin');
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const CopyWebpackPlugin = require(modulePath + 'copy-webpack-plugin')
const HtmlWebpackPlugin = require(modulePath + 'html-webpack-plugin')
const VueLoaderPlugin = require(path.join(modulePath + '/vue-loader/lib/plugin'))
var utils = require('./utils')

const ugli = new ParallelUglifyPlugin({
    cacheDir: '.cache/',
    sourceMap: config.build.productionSourceMap,
    uglifyES: {
        output: {
            comments: false
        },
        compress: {
            warnings: false
        }
    }
})
const optimization = {
    runtimeChunk: {
      name: 'manifest'
    },
    minimizer: [
        ugli
    ], 
    splitChunks:{
      chunks: 'async',
      minSize: 30000,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      name: false,
      cacheGroups: {
        vendor: {
          name: 'vendor',
          chunks: 'initial',
          priority: -10,
          reuseExistingChunk: false,
          test: /node_modules\/(.*)\.js/
        },
        styles: {
          name: 'styles',
          test: /\.(postcss|less|scss|css)$/,
          chunks: 'all',
          minChunks: 1,
          reuseExistingChunk: true,
          enforce: true
        }
      }
    }
}

function resolve(dir) {
    return path.join(path.resolve("."), '', dir)
}

function rebuildForWebpack4(webpackConfig) {
    var pretime = moment().format('X');
    console.log('\x1B[32m', 'rebuild:' + pretime)
    console.log('\x1b[0m')
    return {
        mode: "production",
        entry: {
            app: path.join(resolve('src'), '/main.js'),
            "babel-polyfill": modulePath + "babel-polyfill"
        },
        output: {
            path: config.build.assetsRoot,
            filename: utils.assetsPath('js/[name].[chunkhash].js'),
            chunkFilename: utils.assetsPath('js/[id].[chunkhash].js'),
            publicPath: process.env.NODE_ENV === 'production' ?
                config.build.assetsPublicPath : config.dev.assetsPublicPath
        },
        optimization: optimization,
        resolve: {
            extensions: ['.js', '.vue', '.json'],
            modules: [
                resolve('src'),
                resolve('node_modules'),
                modulePath
            ],
            alias: {
                '@': resolve('src'),
                'vue$': 'vue/dist/vue.esm.js',
                '~': resolve('node_modules')
            }
        },
        performance: {
            hints: false
        },
        resolveLoader: {
            modules: [
                resolve('node_modules'),
                modulePath
            ]
        },
        plugins: [
            new VueLoaderPlugin(),
            new MiniCssExtractPlugin({
                filename: 'css/app.[name].css',
                chunkFilename: 'css/app.[contenthash:12].css' // use contenthash *
            }),
            new HappyPack({
                id: 'happy-babel-js',
                loaders: [modulePath + 'babel-loader?cacheDirectory=true'],
                threadPool: happyThreadPool,
            }),
            new HtmlWebpackPlugin({
                filename: process.env.NODE_ENV === 'testing' ?
                    'index.html' : config.build.index,
                template: 'index.html',
                inject: true,
                minify: {
                    removeComments: true,
                    collapseWhitespace: true,
                    removeAttributeQuotes: true
                },
                origin: config.origin, //编译的时候 这个地方要设置一个移动网关前缀
                activity: config.actJson,
                chunksSortMode: 'none'
            }),
            new CopyWebpackPlugin([{
                from: resolve('static'),
                to: config.build.assetsSubDirectory,
                ignore: ['.*']
            }])
            // ugli
        ],
        module: {
            rules: [{
                    test: /\.vue?$/,
                    loader: path.join(modulePath + 'vue-loader')
                },
                {
                    test: /\.css?$/,
                    use: [{
                        loader: path.join(modulePath + 'style-loader')
                    }, {
                        loader: path.join(modulePath + 'css-loader')
                    }]
                },
                {
                    test: /\.less?$/,
                    use: [{
                        loader: path.join(modulePath + 'style-loader')
                    }, {
                        loader: path.join(modulePath + 'css-loader')
                    }, {
                        loader: path.join(modulePath + 'less-loader'),
                        options: { javascriptEnabled: true }
                    }]
                },
                {
                    test: /\.(sass|scss)?$/,
                    use: [{
                        loader: path.join(modulePath + 'style-loader')
                    }, {
                        loader: path.join(modulePath + 'css-loader')
                    }, {
                        loader: path.join(modulePath + 'sass-loader')
                    }]
                },
                {
                    test: /\.postcss?$/,
                    use: [{
                        loader: path.join(modulePath + 'style-loader')
                    }, {
                        loader: path.join(modulePath + 'css-loader')
                    }, {
                        loader: path.join(modulePath + 'postcss-loader')
                    }]
                },
                {
                    test: /\.js$/,
                    loader: 'happypack/loader?id=happy-babel-js',
                    include: [resolve('src'), resolve('test'), resolve('node_modules/webpack-dev-server/client')]
                },
                {
                    test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
                    loader: path.join(modulePath + 'url-loader'),
                    options: {
                        limit: 10000,
                        name: utils.assetsPath('img/[name].[hash:7].[ext]')
                    }
                },
                {
                    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
                    loader: path.join(modulePath + 'url-loader'),
                    options: {
                        limit: 10000,
                        name: utils.assetsPath('media/[name].[hash:7].[ext]')
                    }
                },
                {
                    test: /\.(woff2?|eot|woff2|ttf|otf)(\?.*)?$/,
                    loader: path.join(modulePath + 'url-loader'),
                    options: {
                        limit: 10000,
                        name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
                    }
                }
            ]
        }
    }
}
module.exports = rebuildForWebpack4