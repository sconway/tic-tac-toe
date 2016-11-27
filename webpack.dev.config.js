// const path    = require('path')
// const webpack = require('webpack')

// module.exports = {
//   devtool: 'eval',

//   entry: [
//     // 'webpack/hot/dev-server',
//     // 'webpack-hot-middleware/client?http://localhost:1243/',
//     // 'webpack-hot-middleware/client?path=/__webpack_hmr&timeout=20000',
//     './src/index.js'
//   ],

//   output: {
//     path: path.join(__dirname, '/public/'),
//     filename: 'bundle.js',
//     // publicPath: '/public/'
//     // path: '/',
//     // publicPath: 'http://localhost:1243/public/'
//   },

//   // plugins: [
//   //   new webpack.optimize.OccurenceOrderPlugin(),
//   //   new webpack.HotModuleReplacementPlugin(),
//   //   new webpack.NoErrorsPlugin()
//   // ],

//   module: {
//     loaders: [
//       { test: /\.js?$/,
//         loader: 'babel',
//         exclude: path.join(__dirname, 'node_modules') },
//       { test: /\.scss?$/,
//         loader: 'style!css!sass',
//         include: path.join(__dirname, 'src', 'sass') },
//       { test: /\.png$/,
//         loader: 'file' },
//       { test: /\.(ttf|eot|svg|woff(2)?)(\?[a-z0-9]+)?$/,
//         loader: 'file'}
//     ]
//   },

//   resolveLoader: {
//     root: [
//       path.join(__dirname, 'node_modules'),
//     ],
//   },

//   resolve: {
//     root: [
//       path.join(__dirname, 'node_modules'),
//     ],
//   },
// }


var path = require('path');
var webpack = require('webpack');

module.exports = {
  entry: [
     // 'webpack/hot/dev-server',
    // 'webpack-hot-middleware/client',
    'webpack-dev-server/client?http://localhost:3000',
    'webpack/hot/only-dev-server',
    './src/index'
  ],

  output: {
    path: path.join(__dirname, 'public'),
    filename: 'bundle.js',
    publicPath: '/public/'
  },

  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  ],

  resolve: {
    extensions: ['', '.js', '.jsx']
  },

  module: {
    loaders: [
      { test: /\.jsx$/,
        loader: 'react-hot!babel',
        include: path.join(__dirname, 'src') },
      { test: /\.js$/,
        loader: 'babel',
        exclude: /node_modules/ },
      { test: /\.scss?$/,
        loader: 'style!css!sass',
        include: path.join(__dirname, 'src/sass') },
      { test: /\.css$/,
        loader: 'style!css' }
    ]
  }
}