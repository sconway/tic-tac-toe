'use strict'

const Server     = require('./src/server.js')
const app        = Server.app()
const httpServer = require('http').Server(app)
const port       = (process.env.PORT || 3000)
const io         = require('socket.io')(httpServer)

let socketSet    = [] // contains the IDs of our sockets


// Development specific tasks
if (process.env.NODE_ENV !== 'production') {
  const webpack              = require('webpack')
  const webpackDevServer     = require('webpack-dev-server')
  const webpackDevMiddleware = require('webpack-dev-middleware')
  const webpackHotMiddleware = require('webpack-hot-middleware')
  const config               = require('./webpack.dev.config.js')
  const compiler             = webpack(config)

  new webpackDevServer(webpack(config), {
    publicPath: config.output.publicPath,
    hot: true
  }).listen(3000, 'localhost', function (err, result) {
    if (err) { console.log(err) }
    console.log('Listening at localhost:3000')
  });
} 

httpServer.listen(port) // Hot Reloading won't work with this :(
console.log(`Listening on http://localhost:${port}`)

// Once we have a connection with the client side.
io.on('connection', (socket) => { 
  console.log("Server Socket Connected")

  const numClients = socket.conn.server.clientsCount
  const socketID   = socket.id

  socketSet.push(socketID)

  let socketIndex = socketSet.indexOf(socketID)
  // const prevSocket  = socketIndex > 0 ? socketSet[socketIndex-1] : null
  // const nextSocket  = socketSet[socketIndex+1]

  // console.log("Current socket: ", io.sockets);
  console.log("Current number of clients: ", numClients)
  console.log("Current Socket ID: ", socketID);
  console.log("Index of current client: ", socketIndex);
  console.log("Socket Set: ", socketSet)

  if (numClients % 2 === 0) {
    console.log("Even Amount of Players")
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    
    io.to(socketID).emit('playerO', numClients)
    io.to(prevSocket).emit('matchFound')
  } else {
    console.log("Odd Amount of Players")
    io.to(socketID).emit('playerX', numClients)
  }

  // if a player move is detected
  socket.on('boardMove', (data) => {
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket;

    console.log("previous socket: ", prevSocket);
    console.log("next socket: ", nextSocket);
    console.log("Board Move by socket: ", socketID);
    console.log("Board Move by socket Index: ", socketIndex);
    console.log("Sending to: ", destination);

    io.to(destination).emit('playerMove', data)
  })

  socket.on('reset', () => {
    console.log("Reset Occurred");
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket;

    io.to(destination).emit('reset');
  })

  // if a winner is detected
  socket.on('winner', (winner) => {
    console.log("Winner occurred: ", winner)

    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket;

    io.to(destination).emit('winner', winner)
  })

  socket.on('disconnect', () => {
    console.log("user disconnected");
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket;
    let numClients = socket.conn.server.clientsCount

    console.log("Num clients After disconnect: ", numClients)
    console.log("Destination After disconnect: ", destination);

    io.to(destination).emit('playerDisconnect')

    if (numClients !== 0) {
      socketSet.splice(socketIndex, 1)
    } else {
      socketSet = []
    }

    console.log("Socket Set After disconnect: ", socketSet)
    console.log("Socket Index After disconnect: ", socketIndex)
  })
})