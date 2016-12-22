const path    = require('path')
const webpack = require('webpack')
var autoprefixer      = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  devtool: 'source-map',

  entry: [
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  plugins: [
    new webpack.optimize.DedupePlugin(),
    new webpack.optimize.UglifyJsPlugin({
      minimize: true,
      compress: {
        warnings: false
      }
    }),
    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new ExtractTextPlugin('app.css')
  ],

  module: {
    loaders: [
      { 
        test: /\.jsx$/,
        loader: 'babel',
        include: path.join(__dirname, 'src') 
      },
      { 
        test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/ 
      },
      { 
        test: /\.scss?$/,
        loader: ExtractTextPlugin.extract(
                    'style-loader', 
                    ['css-loader', 'postcss-loader', 'sass-loader']
                ),
        include: path.join(__dirname, 'src/sass') 
      },
      { 
        test: /\.css$/,
        loader: 'style!css!postcss-loader' 
      }
    ]
  },

  sassLoader: {
      includePaths: [ 'src/sass' ]
  },

  postcss: [ autoprefixer({ browsers: ['last 4 versions'] }) ]

}