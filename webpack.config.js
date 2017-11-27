const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const UglifyJSPlugin = require('uglifyjs-webpack-plugin');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  entry: { 
    vendor: ['babel-polyfill', 'vue', 'axios', 'mint-ui'],
    app: './index.js'
  },
  output: {
    filename: '[name].bundle.js',
    path: path.resolve(__dirname, 'dist')
  },
  devServer: {
      contentBase: './dist'
      // host:'localhost',
      // port: 8080,
      // proxy: {
      //   "/": {
      //     target: 'http://47.95.204.122:9001',
      //     changeOrigin: true,
      //     secure: false
      //   }
      // }
  },
  devtool: 'inline-source-map',
  resolve: ['.tsx', '.ts', '.js'],
  plugins: [
    new HtmlWebpackPlugin({
      title: '闯关',
      template:'./main-page.html'
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: 'vendor'
    }),
    new CleanWebpackPlugin(['dist'])
  ],
  resolve: {
    alias: {
      vue: 'vue/dist/vue.js'
    }
  },
  module: {
    rules: [
      {
          test: /\.(css|less)$/,
          use: [{
              loader: "style-loader" // creates style nodes from JS strings
          }, {
              loader: "css-loader" // translates CSS into CommonJS
          }, {
              loader: "less-loader" // compiles Less to CSS
          }]
      },
      {
        test: /\.js$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['env']
          }
        }
      },
      {
        test: /\.vue$/,
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'vue-loader'
        }
      }
    ]
  }
}