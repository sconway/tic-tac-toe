// var path = require('path');

// var config = {
//   context: path.join(__dirname, 'src'),
//   entry: [
//     './index.js',
//   ],
//   output: {
//     path: path.join(__dirname, 'www'),
//     filename: 'bundle.js',
//   },
//   module: {
//     loaders: [
//       {
//         test: /\.js$/,
//         exclude: /node_modules/,
//         loaders: ['babel'],
//       },
//       {
//         test: /\.css$/,
//         exclude: /node_modules/,
//         loaders: ['style', 'css'],
//         include: __dirname + '/src'
//       }
//     ],
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
// };
// module.exports = config;
