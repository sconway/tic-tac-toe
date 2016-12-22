var path              = require('path');
var webpack           = require('webpack');
var autoprefixer      = require('autoprefixer');
var ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
  entry: [
     // 'webpack/hot/dev-server',
    // 'webpack-hot-middleware/client',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],

  devtool: 'source-map',

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new ExtractTextPlugin('public/app.css')
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { 
        test: /\.jsx$/,
        loader: 'react-hot!babel',
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
                    'style', // The backup style loader
                    'css?sourceMap!sass?sourceMap'
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
