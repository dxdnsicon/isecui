var path = require('path')
var utils = require('./utils')
var config = require(path.resolve(".")+'/config')
var vueLoaderConfig = require('./vue-loader.conf')
const webpack = require('webpack')
const px2rem = require('postcss-px2rem')
const postcss = require('postcss')
const os = require('os')


//这里要使用绝对路径。 指向目标项目根目录
const modulePath = path.join(__dirname+'../../node_modules/');

const HappyPack = require(modulePath+'happypack')
const happyThreadPool = HappyPack.ThreadPool({ size: os.cpus().length })


function resolve (dir) {
  return path.join(path.resolve("."),'', dir)
}

//定义一个happypack 解析器
const happy = new HappyPack({
  id: 'happy-babel-js',
  loaders: [modulePath+'babel-loader?cacheDirectory=true'],
  threadPool: happyThreadPool,
})

module.exports = {
  entry: {
    app: './src/main.js',
    "babel-polyfill":modulePath+"babel-polyfill"
  },
  output: {
    path: config.build.assetsRoot,
    filename: '[name].js',
    publicPath: process.env.NODE_ENV === 'production'
      ? config.build.assetsPublicPath
      : config.dev.assetsPublicPath
  },
  resolve: {
    extensions: ['.js', '.vue', '.json'],
    modules: [
      resolve('src'),
      resolve('node_modules')
    ],
    alias: {
      'echarts': resolve('node_modules/echarts'),
      'jquery': resolve('node_modules/jquery'),
      '@': resolve('src'),
    },
  },
  resolveLoader: {
    modules: [
      resolve('node_modules'),
      modulePath
    ]
  },
  plugins: [
    // new webpack.LoaderOptionsPlugin({
    //     // webpack 2.0之后， 此配置不能直接写在自定义配置项中， 必须写在此处
    //     vue: {
    //         postcss: [require('postcss-px2rem')({ remUnit: 54, propWhiteList: [] })]
    //     }
    // })
      happy
  ],
  module: {
    rules: [
      //这个地方需要对不同类型的文件使用不同的loader
      // {
      //   test: /\.(css)(\?.*)?$/,
      //   use:[{
      //     loader:'style-loader',
      //     options:{
      //       sourceMap: true
      //     }
      //   }]
      // },
      // {
      //   test: /\.(less)(\?.*)?$/,
      //   use:[{
      //     loader:'less-loader',
      //     options:{
      //       sourceMap: true
      //     }
      //   }]
      // },
      {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: vueLoaderConfig,
        include: [resolve('src')],
        exclude: /node_modules\/(?!(autotrack|dom-utils))|vendor\.dll\.js/
      },
      {
        test: /\.js$/,
        loader: 'happypack/loader?id=happy-babel-js',
        include: [resolve('src'), resolve('test'),resolve('node_modules/webpack-dev-server/client')]
      },
      {
        test: /\.(png|jpe?g|gif|svg)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('img/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('media/[name].[hash:7].[ext]')
        }
      },
      {
        test: /\.(woff2?|eot|woff2|ttf|otf)(\?.*)?$/,
        loader: 'url-loader',
        options: {
          limit: 10000,
          name: utils.assetsPath('fonts/[name].[hash:7].[ext]')
        }
      }
    ]
  }
}
