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

  // check for an empty flag to see if a player is without a match.
  if (socketSet.indexOf('!') > -1) {
    let index  = socketSet.indexOf('!')
    socketSet[index] = socketID
  } else {
    socketSet.push(socketID)
  }

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
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

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
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

    io.to(destination).emit('reset');
  })

  // if a winner is detected
  socket.on('winner', (winner) => {
    console.log("Winner occurred: ", winner)

    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket

    io.to(destination).emit('winner', winner)
  })

  socket.on('disconnect', () => {
    console.log("user disconnected");
    let socketIndex = socketSet.indexOf(socketID)
    let prevSocket  = (socketIndex > 0) ? socketSet[socketIndex-1] : 0
    let nextSocket  = socketSet[socketIndex+1] || socketSet[socketIndex] || null
    let destination = (socketIndex + 1) % 2 === 0 ? prevSocket : nextSocket
    let numClients  = socket.conn.server.clientsCount

    console.log("Num clients After disconnect: ", numClients)
    console.log("Socket Index That Disconnected: ", socketIndex)
    console.log("Prev Socket After disconnect: ", prevSocket)
    console.log("Next Socket After disconnect: ", nextSocket)
    console.log("Destination After disconnect: ", destination)

    if (destination) {
      console.log("sending disconnect signal to: ", destination)
      io.to(destination).emit('playerDisconnect')
    }

    if (numClients !== 0) {

      // Check for an empty flag to see if a player is without a match.
      if (socketSet.indexOf('!') > -1) {
        console.log("There is an empty space already. Re-allocating matches.");
        let index  = socketSet.indexOf('!')
        console.log("index of the empty space is: ", index);

        // If player X was the one who quit, move the waiting piece into its spot
        if (socketIndex % 2 === 0) {
          console.log("Player X was the one who just left");
          socketSet[socketIndex] = socketSet[index-1]
          io.to(socketSet[socketIndex+1]).emit('playerO', numClients)
          io.to(socketSet[socketIndex]).emit('matchFound')
          socketSet.splice(index-1, 2)
        } else {
          console.log("Player O was the one who just left");
          socketSet[socketIndex] = socketSet[index-1]
          io.to(socketSet[socketIndex]).emit('playerO', numClients)
          io.to(socketSet[socketIndex-1]).emit('matchFound')
          socketSet.splice(index-1, 2)
        }
      }

      // If there is a player without a match when someone disconnects,
      // pair the waiting player up with the player who lost their match
      else if (socketSet.length % 2 !== 0) {
        console.log("Odd number of players after disconnect");
        // if the player who left was player 'x', move the partner to 'x',
        // and set the waiting player to be player 'o'
        if (socketIndex % 2 === 0) { 
          console.log("It was Player X who left")
          // Make sure there is a next socket
          if (socketSet[socketIndex+1]) {
            console.log("Player X was not the last player.")
            console.log("Moving player O into the old X spot, and the waiting piece into O's spot")
            socketSet[socketIndex]   = socketSet[socketIndex+1]
            socketSet[socketIndex+1] = socketSet[socketSet.length-1]
            io.to(socketSet[socketIndex+1]).emit('playerO', numClients)
            io.to(socketSet[socketIndex]).emit('matchFound')
            console.log("Removing the waiting piece since it has now been moved")
            socketSet.splice(socketSet.length-1, 1)
          } else {
            console.log("It was the last player that left. Removing from the socket array")
            socketSet.splice(socketSet.length-1, 1)
          }
        } else {
          console.log("It was player O that left Move the waiting piece there")
          socketSet[socketIndex] = socketSet[socketSet.length-1]
          io.to(socketSet[socketIndex]).emit('playerO', numClients)
          io.to(socketSet[socketIndex-1]).emit('matchFound')
          console.log("Removing the waiting piece since it has now been moved")
          socketSet.splice(socketSet.length-1, 1)
        }
      } 

      else {
        console.log("Even number of Players after disconnect")
        // If the first player quits, move the partner into it's position
        // and set the second position to be empty. So if player 'x' quits,
        // player 'o' will become 'x' and the next match will take player 'o'
        if (socketIndex % 2 === 0) {
          console.log("Socket that left was Player X, setting it to be next player or '!' ");
          socketSet[socketIndex] = socketSet[socketIndex+1] || '!'
          if (socketSet[socketIndex+1]) {
            console.log("Setting Player O's spot to !");
            socketSet[socketIndex+1] = '!'
          } 
        } else {
          console.log("Setting Player O's spot to !");
          socketSet[socketIndex] = '!'
        }
      }

    } else {
      socketSet = []
    }

    console.log("Socket Set After disconnect: ", socketSet)
    console.log("Socket Index After disconnect: ", socketIndex)
  })
})