// var express              = require('express');
// var webpackDevMiddleware = require('webpack-dev-middleware');
// var webpack              = require('webpack');
// var http                 = require('http');
// var webpackConfig        = require('./webpack.config.js');
// var app                  = express();
// var compiler             = webpack(webpackConfig),
//     port                 = process.env.PORT || 1243;


// app.use(webpackDevMiddleware(compiler, {
//   hot: true,
//   filename: 'bundle.js',
//   publicPath: '/',
//   stats: {
//     colors: true,
//   },
//   historyApiFallback: true,
// }));

// app.use(express.static(__dirname + '/public'));

// // Fire this bitch up (start our server)
// var server = http.createServer(app).listen(port, function() {
//   console.log('Express server listening on port ' + port);
// });

// // var server = app.listen(3000, function() {
// //   var host = server.address().address;
// //   var port = server.address().port;
// //   console.log('Example app listening at http://%s:%s', host, port);
// // });

// var io = require('socket.io')(server);

// // Once we have a connection with the client side.
// io.on('connection', function(socket) { 
//   console.log("Server Socket Connected");

//   var numClients = socket.conn.server.clientsCount,
//       socketID   = socket.id;

//   // console.log("Current socket: ", io.sockets);
//   console.log("Current number of clients: ", numClients);
//   console.log("Current Socket ID: ", socketID);

//   socket.on('componentMounted', function(){
//     if (numClients % 2 === 0) {
//       io.to(socketID).emit('playerO', numClients);
//       console.log("Even Amount of Players");
//     } else {
//       io.to(socketID).emit('playerX', numClients);
//       console.log("Odd Amount of Players");
//     }
//   });

//   // if a player move is detected
//   socket.on('boardMove', function(data) {
//     console.log("Board Move: ", data);
//     // io.emit('playerMove', data);
//     socket.broadcast.emit('playerMove', data);
//   });

//    // if a winner is detected
//   socket.on('winner', function(winner) {
//     console.log("Winner occurred: ", winner);
//     // io.emit('playerMove', data);
//     socket.broadcast.emit('winner', winner);
//   });
// });



