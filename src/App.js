import React, { Component } from 'react';
import Styles from '../src/css/app.css';
import Tile from "./Tile.js";
import Menu from "./Menu.js";
import Announcement from "./Announcement.js";
import io from 'socket.io-client'

// let css = require("css-loader!./App.css");
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
    }
    this.player = 'x';
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
      //Make game over component visible
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
          winner: this.state.turn 
        }, this.sendWinner, this);
        return;
      }


      // if (middleRow.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (bottomRow.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (leftCol.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (middleCol.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (rightCol.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (leftDiag.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }


      // if (rightDiag.match(/xxx|ooo/)){
      //   this.setState({ winner: this.state.turn });
      //   return;
      // }

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
    this.setState({
      winner: winner
    });
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

  updateState(data) {
    console.log("updateState Called");
    this.setState({
      gameBoard: data.gameBoard,
      turn: data.turn
    });
  }

  /**
   * Called once this component is rendered.
   */
  componentDidMount() {
    console.log('Component Mounted in App.js');
    let that = this;


    // let the server know the component is ready.
    socket.emit('componentMounted');

    // when we make the connection with the server socket.
    socket.on('connect', function() {
      console.log('Client socket connected');
      console.log("socket ID: ", socket.io.engine.id);
    });

    // when we get an updated player count..
    socket.on('playerX', function(count) {
      that.player = 'x';
      console.log("You are Player: ", that.player);
      console.log("Turn: ", that.state.turn);
    });

    socket.on('playerO', function(count) {
      that.player = 'o';
      console.log("You are Player: ", that.player);
      console.log("Turn: ", that.state.turn);
    });

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
        <Menu reset={this.resetBoard.bind(this)} />
        <Announcement 
          reset={this.resetBoard.bind(this)} 
          winner={this.state.winner} />
        <div className='board'>
          {this.state.gameBoard.map((value, i) => {
            return (
              <Tile
                key={i}
                loc={i}
                value={value}
                handleClick={this.handleClick.bind(this)}
                turn={this.state.turn} />
            );
          })}
        </div>
      </div>
    );
  }
}
