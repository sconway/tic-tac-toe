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
  const numClients = socket.conn.server.clientsCount
  const socketID   = socket.id

  // check for an empty flag to see if a player is without a match.
  if (socketSet.indexOf('!') > -1) {
    let index  = socketSet.indexOf('!')
    socketSet[index] = socketID
  } else {
    socketSet.push(socketID)
  }

  let socketIndex = socketSet.indexOf(socketID)

  // If there is an even number of players, the latest player is player 'O'
  if (numClients % 2 === 0) {
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    
    io.to(socketID).emit('playerO', numClients)
    io.to(prevSocket).emit('matchFound')
  } else {
    io.to(socketID).emit('playerX', numClients)
  }

  // if a player move is detected
  socket.on('boardMove', (data) => {
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

    if (destination)
      io.to(destination).emit('playerMove', data)
  })

  socket.on('reset', () => {
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

    if (destination)
      io.to(destination).emit('reset');
  })

  // if a winner is detected
  socket.on('winner', (winner) => {
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

    if (destination)
      io.to(destination).emit('winner', winner)
  })

  // when the player disconnects
  socket.on('disconnect', () => {
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket
    let numClients  = socket.conn.server.clientsCount

    if (destination)
      io.to(destination).emit('playerDisconnect')

    if (numClients !== 0) {

      // Check for an empty flag to see if a player is without a match.
      if (socketSet.indexOf('!') > -1) {
        let index  = socketSet.indexOf('!')

        // If player X was the one who quit, move the waiting piece into its spot
        if (socketIndex % 2 === 0) {
          socketSet[socketIndex] = socketSet[index-1]
          io.to(socketSet[socketIndex+1]).emit('playerO', numClients)
          io.to(socketSet[socketIndex]).emit('matchFound')
          socketSet.splice(index-1, 2)
        } else {
          socketSet[socketIndex] = socketSet[index-1]
          io.to(socketSet[socketIndex]).emit('playerO', numClients)
          io.to(socketSet[socketIndex-1]).emit('matchFound')
          socketSet.splice(index-1, 2)
        }
      }

      // If there is a player without a match when someone disconnects,
      // pair the waiting player up with the player who lost their match
      else if (socketSet.length % 2 !== 0) {
        // if the player who left was player 'x', move the partner to 'x',
        // and set the waiting player to be player 'o'
        if (socketIndex % 2 === 0) { 
          // Make sure there is a next socket
          if (socketSet[socketIndex+1]) {
            socketSet[socketIndex]   = socketSet[socketIndex+1]
            socketSet[socketIndex+1] = socketSet[socketSet.length-1]
            io.to(socketSet[socketIndex+1]).emit('playerO', numClients)
            io.to(socketSet[socketIndex]).emit('matchFound')
            socketSet.splice(socketSet.length-1, 1)
          } else {
            socketSet.splice(socketSet.length-1, 1)
          }
        } else {
          socketSet[socketIndex] = socketSet[socketSet.length-1]
          io.to(socketSet[socketIndex]).emit('playerO', numClients)
          io.to(socketSet[socketIndex-1]).emit('matchFound')
          socketSet.splice(socketSet.length-1, 1)
        }
      } 

      else {
        // If the first player quits, move the partner into it's position
        // and set the second position to be empty. So if player 'x' quits,
        // player 'o' will become 'x' and the next match will take player 'o'
        if (socketIndex % 2 === 0) {
          socketSet[socketIndex] = socketSet[socketIndex+1] || '!'
          if (socketSet[socketIndex+1]) {
            socketSet[socketIndex+1] = '!'
          } 
        } else {
          socketSet[socketIndex] = '!'
        }
      }

    } else {
      socketSet = []
    }

  })
})
