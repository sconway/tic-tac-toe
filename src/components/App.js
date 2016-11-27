import React, { Component } from 'react'
// import Tile from "./Tile.js"
import Menu from "./Menu.js"
import Announcement from "./Announcement.js"
import SideBar from "./SideBar.js"
import Board from "./Board.js"
import io from 'socket.io-client'

let host   = document.location.hostname + ":" + document.location.port;
let socket = io(host);

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      gameBoard: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ],
      winner: null,
      turn: 'x'
    };
    this.player = null;
    this.matchFound = null;
    this.isWaiting = true;
  }

  /**
   * Called when the reset button is clicked, this function
   * sets the board back to the default state.
   */
  resetBoard(){
    this.setState({
      gameBoard: [
        ' ',' ',' ',
        ' ',' ',' ',
        ' ',' ',' '
      ],
      winner: null,
      turn: 'x'
    });
  }

  /*
   * Called when the reset button is clicked. Sends a message to 
   * the server and clears the state of the game.
   */
  onReset(){
    socket.emit('reset');
    this.resetBoard();
  }

  /**
   * Called after the game board state is set, this function checks for
   * any winners and updates the current state with the winner. 
   */
  checkForWinner() {
    console.log("checkForWinner Called");
    //Check if there is a winner or draw
    var moves = this.state.gameBoard.join('').replace(/ /g,'');

    console.log(this.state.winner, this.state.turn, this.state.gameBoard);

    if (moves.length === 9) {
      this.setState({ winner: 'd'  });
      return;
    } else {
      var topRow    = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
      var middleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
      var bottomRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
      var leftCol   = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
      var middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
      var rightCol  = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
      var leftDiag  = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
      var rightDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];

      if (topRow.match(/xxx|ooo/)   || middleRow.match(/xxx|ooo/) ||
          leftCol.match(/xxx|ooo/)  || middleCol.match(/xxx|ooo/) ||
          rightCol.match(/xxx|ooo/) || leftDiag.match(/xxx|ooo/)  ||
          rightDiag.match(/xxx|ooo/)) {
        this.setState({ 
          winner: (this.state.turn === 'x' ? 'o' : 'x')
        }, this.sendWinner, this);
        return;
      }

      // If we make it this far, there hasn't been a winner yet.
      console.log("emitting board move");
      socket.emit('boardMove', this.state);
    }
  }

  /**
   * Called if a winner is determined in the checkWinner function. 
   * Emits the winner of the game for the server to see.
   */
  sendWinner() {
    socket.emit('winner', this.state.winner);
  }

  /**
   * Updates the state with the winner of the game. Called when a
   * 'winner' signal is received from the socket.
   *
   * @param winner : String
   *
   */
  onWinner(winner) {
    this.setState({ winner: winner });
  }

  /**
   * Called when a tile is clicked, this function checks if it
   * is a valid move and 
   */
  handleClick(loc, player) {
    if (this.player === this.state.turn) {
      console.log("handleClick Called");
      console.log("Player: ", this.player);
      console.log("Turn: ", this.state.turn);

      let currentGameBoard = this.state.gameBoard;
      
      //make game over component visible
      if (this.state.winner !== null) {
        console.log("Winner", this.state.winner);
        return;
      }

      //invalid move
      if (this.state.gameBoard[loc] !== ' ') {
        return;
      }

      currentGameBoard.splice(loc, 1, this.state.turn);

      this.updateBoard(currentGameBoard);
    }
  }
  
  /**
   * Calls the set state function to update the gameboard and
   * check for a winner once that is done.
   */
  updateBoard(currentBoard) {
    console.log("updateBoard Called");
    this.setState({
      gameBoard: currentBoard,
      turn: (this.state.turn === 'x') ? 'o' : 'x' 
    }, this.checkForWinner, this);
  }

  /**
   * Sets the current state based on the information received
   * in the parameter.
   *
   * @param data : object
   *
   */
  updateState(data) {
    console.log("updateState Called");
    this.setState({
      gameBoard: data.gameBoard,
      turn: data.turn
    });
  }

  updateIntro() {
    console.log("updateIntro Called")
    let that = this;
    
    setTimeout(() => {
      console.log("no longer waiting");

      that.isWaiting = false;
      that.setState(that.state);
    }, 2000);
  }

  /**
   * Called once this component is rendered.
   */
  componentDidMount() {
    console.log('Component Mounted in App.js');
    let that = this;

    // when we make the connection with the server socket.
    socket.on('connect', function() {
      console.log('Client socket connected');
      console.log("socket ID: ", socket.io.engine.id);
    });

    // when we get an updated player count..
    socket.on('playerX', function(count) {
      that.player = 'x';
      that.isWaiting = true;
      console.log("You are Player: ", that.player);
      console.log("Turn: ", that.state.turn);
      that.setState(that.state);
    });

    socket.on('playerO', function(count) {
      that.player = 'o';
      that.matchFound = true;
      console.log("You are Player: ", that.player);
      console.log("Turn: ", that.state.turn);
      that.setState(that.state, that.updateIntro);
    });

    // when we find a pair for the odd player
    socket.on('matchFound', function() {
      console.log("Match Found");
      that.matchFound = true;
      that.setState(that.state, that.updateIntro);
    })

    // when a player move event is detected.
    socket.on('playerMove', function(data) {
      console.log('Player Move Detected');
      that.updateState(data);
    }); 

    // when a player has won the game.
    socket.on('winner', function(winner) {
      console.log('Game over. Winner is: ', winner);
      that.onWinner(winner);
    });

    // when a player clicks the reset button
    socket.on('reset', function(winner) {
      that.resetBoard()
    })

    // if the other player disconnects
    socket.on('playerDisconnect', function() {
      that.isWaiting = true;
      that.matchFound = null;
      that.player = 'x';
      that.resetBoard()
    })

    // console.log("client ID again: ", socket.io.engine.id);
    // let the server know the component is ready.
    // socket.emit('componentMounted', socket.io.engine.id);
  }

  componentWillMount() {
    console.log('App will Mount');
  }

  componentWillUnmount() {
    console.log('App will UnMount');
  }

  render(){
    return (
      <div className='container'>
        <Menu 
          reset={this.onReset.bind(this)}
          turn={this.state.turn}
          player={this.player} />
        <SideBar player={this.player} />
        <Announcement 
          reset={this.onReset.bind(this)}
          isWaiting={this.isWaiting}
          matchFound={this.matchFound}
          player={this.player} 
          winner={this.state.winner} />
        <Board 
          gameBoard={this.state.gameBoard}
          handleClick={this.handleClick.bind(this)}
          turn={this.state.turn} />
      </div>
    );
  }
}
