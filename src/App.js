const Server = require('./server.js')
const port = (process.env.PORT || 1243)
const app = Server.app()
const httpServer = require('http').Server(app)
const io = require('socket.io')(httpServer)

if (process.env.NODE_ENV !== 'production') {
  const webpack = require('webpack')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config = require('../webpack.dev.config.js')
  const compiler = webpack(config)

  app.use(webpackHotMiddleware(compiler))
  app.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath
  }))
}

httpServer.listen(port)
console.log(`Listening at http://localhost:${port}`)

// var io = require('socket.io')(server);

// Once we have a connection with the client side.
io.on('connection', function(socket) { 
  console.log("Server Socket Connected");

  var numClients = socket.conn.server.clientsCount,
      socketID   = socket.id;

  // console.log("Current socket: ", io.sockets);
  console.log("Current number of clients: ", numClients);
  console.log("Current Socket ID: ", socketID);

  socket.on('componentMounted', function(){
    if (numClients % 2 === 0) {
      io.to(socketID).emit('playerO', numClients);
      console.log("Even Amount of Players");
    } else {
      io.to(socketID).emit('playerX', numClients);
      console.log("Odd Amount of Players");
    }
  });

  // if a player move is detected
  socket.on('boardMove', function(data) {
    console.log("Board Move: ", data);
    // io.emit('playerMove', data);
    socket.broadcast.emit('playerMove', data);
  });

   // if a winner is detected
  socket.on('winner', function(winner) {
    console.log("Winner occurred: ", winner);
    // io.emit('playerMove', data);
    socket.broadcast.emit('winner', winner);
  });
});