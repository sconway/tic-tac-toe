import React, { Component } from 'react';
import { playerConnected, playerDisconnected, boardCleared, playerSet, foundMatch, moveMade, stoppedWaiting } from '../actions/index';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import Menu from "./Menu.js";
import Announcement from "./Announcement.js";
import SideBar from "./SideBar.js";
import Board from "../containers/Board.js";
import io from 'socket.io-client';
import * as idleHelpers from './utilities/idleHelpers.js';

class App extends Component {
  constructor(){
    super();

    this.connectionCheck  = this.checkConnect.bind(this);
    this.connectionMutex  = true;
    this.host             = document.location.hostname + ":" + document.location.port;
    this.socket           = null;
  }

  /*
   * Dispatches the boardCleared action with the supplied params.
   *
   * @param    wait : boolean
   * @param    ai : boolean
   * @param    dis : boolean
   * @param    idle : boolean
   */
  clearBoard(wait, ai, dis, idle) {
    this.props.boardCleared({
      isWaiting:           wait,
      isPlayingAI:         ai,
      didPlayerDisconnect: dis,
      isPlayerIdle:        idle
    })
  }

  /*
   * Called when the reset button is clicked. Sends a message to 
   * the server and clears the state of the game.
   *
   * @param    isPlayingAI : boolean
   */
  onReset(isPlayingAI){
    this.socket.emit('reset');

    this.clearBoard(false, isPlayingAI, false, false);
  }

  /**
   * Called when a tile is clicked, this function checks if it
   * is a valid move and updates the game state if it is.
   *
   * @param    board       : Array
   * @param    loc         : Integer
   * @param    player      : String
   * @param    isPlayingAI : Boolean
   *
   */
  handleClick(board, loc, player, turn, isPlayingAI) {
    let move = {
      index: loc,
      player: player,
      isPlayingAI: isPlayingAI
    }
    
    this.props.moveMade(move);

    if (!isPlayingAI) 
      this.socket.emit('boardMove', move);
  }

  /**
   * Sets up the waiting player to play a randomized AI. Disconnects them
   * from the current socket and removes the listeners for an idle player.
   */
  playAI() {
    idleHelpers.removeListeners();
    
    this.socket.disconnect();

    this.clearBoard(false, true, false, false);
  }

  /**
   * Reconnects the player to the server and updates the state
   * to reflect a new game starting.
   */ 
  reconnectPlayer() {
    idleHelpers.removeListeners();

    this.socket.connect();

    this.clearBoard(true, false, false, false);
  }

  /**
   * Called after a match is found, this function sets the 
   * waiting variable to be false
   */
  fadeIntroOut() {
    let that = this;
    
    setTimeout(() => {
      that.props.stoppedWaiting();
    }, 2000);
  }

  /*
   * Handles the functionality related to the socket connections.
   */
  connectSocket() {
    let that = this;

    this.socket = io(this.host);

    // when we make the connection with the server socket.
    this.socket.on('connect', () => {
      idleHelpers.setupIdleTimer(this.socket, this.clearBoard.bind(this));
    });

    // when we get an updated player count..
    this.socket.on('playerX', (count) => {
      console.log("player X called");

      this.props.playerConnected('x');
    });

    this.socket.on('playerO', (count) => {
      console.log("player O called");

      this.props.playerConnected('o');
      that.fadeIntroOut();
    });

    // when we find a pair for the odd player
    this.socket.on('matchFound', () => {
      console.log("match Found");

      this.props.foundMatch();
      that.fadeIntroOut();
    });

    // when a player move event is detected.
    this.socket.on('playerMove', (move) => {
      this.props.moveMade(move);
    }); 

    // when a player clicks the reset button
    this.socket.on('reset', () => {
      this.clearBoard(false, false, false, false);
    });

    // if the other player disconnects
    this.socket.on('playerDisconnect', () => {
      this.clearBoard(true, false, true, false);
    });
  }

  /**
   * Calls the function to connect to the server socket. Removes the idle
   * event listeners from the document after it gets called.
   */
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
   * Called when this component gets rendered.
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
          turn           ={this.props.turn}
          player         ={this.props.player} /> 
        <SideBar
          player         ={this.props.player} />
        <Announcement 
          onReset        ={this.onReset.bind(this)}
          isWaiting      ={this.props.isWaiting}
          matchFound     ={this.props.matchFound}
          disconnect     ={this.props.playerDisconnect}
          player         ={this.props.player} 
          winner         ={this.props.winner}
          isPlayingAI    ={this.props.isPlayingAI} 
          isPlayerIdle   ={this.props.isPlayerIdle}
          reconnectPlayer={this.reconnectPlayer.bind(this)}
          playAI         ={this.playAI.bind(this)} />
        <Board
          handleClick    ={this.handleClick.bind(this)} 
          player         ={this.props.player} 
          turn           ={this.props.turn}
          isPlayingAI    ={this.props.isPlayingAI} />
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return {
    player:            state.GameReducer.player,
    turn:              state.GameReducer.turn,
    isPlayingAI:       state.GameReducer.isPlayingAI,
    isWaiting:         state.GameReducer.isWaiting,
    matchFound:        state.GameReducer.matchFound,
    playerDisconnect:  state.GameReducer.playerDisconnect,
    winner:            state.GameReducer.winner,
    isPlayerIdle:      state.GameReducer.isPlayerIdle
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators({
    boardCleared,
    playerSet,
    playerConnected,
    playerDisconnected,
    foundMatch,
    moveMade,
    stoppedWaiting
  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(App);



