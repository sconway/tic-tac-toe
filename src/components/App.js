import React, { Component } from 'react'
import Menu from "./Menu.js"
import Announcement from "./Announcement.js"
import SideBar from "./SideBar.js"
import Board from "./Board.js"
import io from 'socket.io-client'
import idleHelpers from './utilities/idleHelpers.js'

export default class App extends Component {
  constructor(){
    super();
    this.state = {
      gameBoard: [
        ' ', ' ', ' ',
        ' ', ' ', ' ',
        ' ', ' ', ' '
      ],
      isPlayingAI: false,
      isWaiting: true,
      matchFound: false,
      isPlayerIdle: false,
      playerDisconnect: false,
      player: null,
      winner: null,
      turn: 'x'
    };
    this.timerReset       = idleHelpers.resetTimer.bind(this);
    this.connectionCheck  = this.checkConnect.bind(this);
    this.timeoutID        = null;
    this.connectionMutex  = true;
    this.host   = document.location.hostname + ":" + document.location.port;
    this.socket = null;
  }

  /*
   * Helper function that returns a random number between the two supplied
   * numbers. 
   *
   *  @param min  :  Integer
   *  @param max  :  Integer
   */
  rando(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
  }

  /*
   * Called when the reset button is clicked. Sends a message to 
   * the server and clears the state of the game.
   */
  onReset(isPlayingAI){
    this.socket.emit('reset');
    this.resetBoard(false, isPlayingAI, false);
  }

  /**
   * Returns the next turn based on the supplied current turn.
   *
   * @param currentTurn : String
   */
  nextTurn(currentTurn) {
    return (currentTurn === 'x' ? 'o' : 'x' );
  }

  /**
   * Called if a winner is determined in the checkWinner function. 
   * Emits the winner of the game for the server to see.
   */
  sendWinner(isPlayingAI, winner) {
    console.log("sendWinner called: ", winner);
    if (!isPlayingAI) {
      this.socket.emit('winner', winner);
    }
  }

  sendBoardUpdate(isPlayingAI, curState) {
    console.log("sendBoardUpdate Called. State is: ", curState)
    if (!isPlayingAI) {
      this.socket.emit('boardMove', curState);
    } else {
      this.makeAIMove(curState);
    }
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
   * Called when the reset button is clicked, this function
   * sets the board back to the default state. Sets the game
   * state to be waiting if the parameter is true.
   *
   * @param isWaiting : Boolean
   *
   */
  resetBoard(isWaiting, isPlayingAI, playerDisconnect){
    this.setState({
      gameBoard: [
        ' ',' ',' ',
        ' ',' ',' ',
        ' ',' ',' '
      ],
      isPlayerIdle: false,
      isPlayingAI: isPlayingAI,
      isWaiting: isWaiting,
      playerDisconnect: playerDisconnect,
      matchFound: false,
      winner: null,
      player: 'x',
      turn: 'x'
    });
  }

  getWinner() {
    let moves     = this.state.gameBoard.join('').replace(/ /g,'');
    let topRow    = this.state.gameBoard[0] + this.state.gameBoard[1] + this.state.gameBoard[2];
    let middleRow = this.state.gameBoard[3] + this.state.gameBoard[4] + this.state.gameBoard[5];
    let bottomRow = this.state.gameBoard[6] + this.state.gameBoard[7] + this.state.gameBoard[8];
    let leftCol   = this.state.gameBoard[0] + this.state.gameBoard[3] + this.state.gameBoard[6];
    let middleCol = this.state.gameBoard[1] + this.state.gameBoard[4] + this.state.gameBoard[7];
    let rightCol  = this.state.gameBoard[2] + this.state.gameBoard[5] + this.state.gameBoard[8];
    let leftDiag  = this.state.gameBoard[0] + this.state.gameBoard[4] + this.state.gameBoard[8];
    let rightDiag = this.state.gameBoard[2] + this.state.gameBoard[4] + this.state.gameBoard[6];

    // Check for any winning combinations
    if (topRow.match(/xxx|ooo/)   || middleRow.match(/xxx|ooo/) ||
        leftCol.match(/xxx|ooo/)  || middleCol.match(/xxx|ooo/) ||
        rightCol.match(/xxx|ooo/) || leftDiag.match(/xxx|ooo/)  ||
        rightDiag.match(/xxx|ooo/ || bottomRow.match(/xxx|ooo/))) {
      return this.nextTurn(this.state.turn);
    } else if (moves.length === 9) {
      return 'd';
    } else {
      return null;
    }
  }

  /**
   * Called when a tile is clicked, this function checks if it
   * is a valid move and 
   */
  handleClick(loc, player, isPlayingAI) {
    console.log("handle clicked called: ", loc, player, isPlayingAI, this.state.turn);
    if (player === this.state.turn) {
      let currentGameBoard = this.state.gameBoard;
      
      //someone won
      if (this.state.winner !== null) {
        return;
      }

      //invalid move
      if (this.state.gameBoard[loc] !== ' ') {
        return;
      }

      currentGameBoard.splice(loc, 1, this.state.turn);
      this.updateBoard(currentGameBoard, isPlayingAI);
    }
  }

  /**
   * Sets up the waiting player to play a randomized AI
   */
  playAI() {
    idleHelpers.removeListeners();
    this.socket.disconnect();
    this.resetBoard(false, true, false);
  }

  /**
   * Reconnects the player to the server and updates the state
   * to reflect a new game starting.
   */ 
  reconnectPlayer() {
    console.log("Reconnect player. Socket is: ", this.socket);
    idleHelpers.removeListeners();
    this.socket.connect();
    this.resetBoard(true, false, false);
  }

  /**
   * Simulates a player click using a very simple(dumb, naive, etc) AI
   */
  makeAIMove(curState) {
    console.log("makeAIMove called: ", curState);
    let boardLength = curState.gameBoard.length;
    let moveIndex   = this.rando(0, boardLength);

    // Only simulate the click on a space that doesn't have a piece placed
    if (curState.gameBoard[moveIndex] === ' ') {
      console.log("making AI move at index: ", moveIndex);
      this.handleClick(moveIndex, 'o', true);
    } else {
      this.makeAIMove(curState);
    }
  }

  /**
   * Called after the board state is set. This function checks for a winner
   * and handles the AI or human aspects of the game.
   */
  afterBoardUpdate(isPlayingAI, curState) {
    console.log("afterBoardUpdate called: ", curState)
    let winner = this.getWinner()

    if (winner) {
      this.setState({ 
        winner: winner
      }, () => {
        this.sendWinner(isPlayingAI, this.state.winner);
      });
    } else {
      this.sendBoardUpdate(isPlayingAI, curState);
    }
  }
  
  /**
   * Calls the set state function to update the gameboard and
   * check for a winner once that is done.
   */
  updateBoard(currentBoard, isPlayingAI) {
    console.log("updateBoard Called");

    this.setState({
      gameBoard: currentBoard,
      turn: this.nextTurn(this.state.turn)
    }, () => {
      this.afterBoardUpdate(isPlayingAI, this.state)
    });
  }

  /**
   * Sets the current state based on the information received
   * in the parameter.
   *
   * @param data : object
   *
   */
  updateState(data) {
    console.log("updateState Called: ", data);
    this.setState({
      gameBoard: data.gameBoard,
      turn: data.turn
    });
  }

  /**
   * Called after a match is found, this function sets the 
   * waiting variable to be false
   */
  updateIntro() {
    console.log("updateIntro Called") 
    let that = this;
    
    setTimeout(() => {
      console.log("no longer waiting");

      that.setState({ isWaiting: false });
    }, 2000);
  }

  connectSocket() {
    let that = this;

    this.socket = io(this.host);

    // when we make the connection with the server socket.
    this.socket.on('connect', () => {
      console.log('Client socket connected');
      console.log("socket ID: ", this.socket.io.engine.id);
      idleHelpers.setupIdleTimer();
    })

    // when we get an updated player count..
    this.socket.on('playerX', (count) => {
      that.setState({ 
        isWaiting: true,
        player: 'x'
      });
    })

    this.socket.on('playerO', (count) => {
      that.setState({
        player: 'o',
        matchFound: true
      }, that.updateIntro);
    })

    // when we find a pair for the odd player
    this.socket.on('matchFound', () => {
      that.setState({
        matchFound: true
      }, that.updateIntro);
    })

    // when a player move event is detected.
    this.socket.on('playerMove', (data) => {
      that.updateState(data);
    }) 

    // when a player has won the game.
    this.socket.on('winner', (winner) => {
      that.onWinner(winner);
    })

    // when a player clicks the reset button
    this.socket.on('reset', (winner) => {
      that.resetBoard(false, false, false);
    })

    // if the other player disconnects
    this.socket.on('playerDisconnect', () => {
      console.log("Other Player Disconnected");
      that.resetBoard(true, false, true);
    })
  }

  checkConnect() {
    console.log("checkConnect called. mutex is: ", this.connectionMutex);
    if (this.connectionMutex) {
      this.connectionMutex = false;
      this.connectSocket();
    } else {
      document.removeEventListener('mousemove', this.connectionCheck, false);
      document.removeEventListener('touchstart', this.connectionCheck, false);
    }
  }

  /**
   * Called once this component is rendered.
   */
  componentDidMount() {
    console.log('Component Mounted in App.js');
    
    document.addEventListener('mousemove', this.connectionCheck, false);
    document.addEventListener('touchstart', this.connectionCheck, false);
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
          turn  ={this.state.turn}
          player={this.state.player} />
        <SideBar 
          player={this.state.player} />
        <Announcement 
          onReset        ={this.onReset.bind(this)}
          isWaiting      ={this.state.isWaiting}
          matchFound     ={this.state.matchFound}
          disconnect     ={this.state.playerDisconnect}
          player         ={this.state.player} 
          winner         ={this.state.winner}
          isPlayingAI    ={this.state.isPlayingAI} 
          isPlayerIdle   ={this.state.isPlayerIdle}
          reconnectPlayer={this.reconnectPlayer.bind(this)}
          playAI         ={this.playAI.bind(this)} />
        <Board 
          gameBoard      ={this.state.gameBoard}
          handleClick    ={this.handleClick.bind(this)}
          isPlayingAI    ={this.state.isPlayingAI}
          player         ={this.state.player}
          turn           ={this.state.turn} />
      </div>
    );
  }
}
