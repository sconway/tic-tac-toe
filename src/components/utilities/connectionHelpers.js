import io from 'socket.io-client'
import idleHelpers from './idleHelpers.js'

let connectionHelpers = {

  checkConnect() {
    console.log("checkConnect called. mutex is: ", this.connectionMutex);
    if (this.connectionMutex) {
      this.connectionMutex = false;
      this.connectSocket();
    } else {
      document.removeEventListener('mousemove', this.connectionCheck, false);
      document.removeEventListener('touchstart', this.connectionCheck, false);
    }
  },
  
  connectSocket() {
    let that = this;

    console.log("state: ", that.state);
    console.log("state2: ", this.state);

    this.socket = io(this.host);

    // when we make the connection with the server socket.
    this.socket.on('connect', () => {
      console.log('Client socket connected');
      console.log("socket ID: ", this.socket.io.engine.id);
      idleHelpers.setupIdleTimer();
    })

    // when we get an updated player count..
    this.socket.on('playerX', (count) => {
      that.player    = 'x';
      console.log("You are Player: ", that.player);
      console.log("Turn: ", this.state.turn);
      that.setState({ isWaiting: true });
    })

    this.socket.on('playerO', (count) => {
      that.player     = 'o';
      that.matchFound = true;
      console.log("You are Player: ", that.player);
      console.log("Turn: ", this.state.turn);
      that.setState(that.state, that.updateIntro);
      // that.setupIdleTimer();
    })

    // when we find a pair for the odd player
    this.socket.on('matchFound', () => {
      console.log("Match Found");
      that.matchFound = true;
      that.setState(that.state, that.updateIntro);
      // that.setupIdleTimer();
    })

    // when a player move event is detected.
    this.socket.on('playerMove', (data) => {
      console.log('Player Move Detected');
      that.updateState(data);
    }) 

    // when a player has won the game.
    this.socket.on('winner', (winner) => {
      console.log('Game over. Winner is: ', winner);
      that.onWinner(winner);
    })

    // when a player clicks the reset button
    this.socket.on('reset', (winner) => {
      that.resetBoard(false, false)
    })

    // if the other player disconnects
    this.socket.on('playerDisconnect', () => {
      console.log("Other Player Disconnected");
      that.playerDisconnect = true;
      that.matchFound       = null;
      that.player           = 'x';
      that.resetBoard(true, false)
    })
  },

  /**
   * Reconnects the player to the server and updates the state
   * to reflect a new game starting.
   */ 
  reconnectPlayer() {
    console.log("Reconnect player. Socket is: ", this.socket);
    idleHelpers.removeListeners();
    this.socket.connect();
    this.resetBoard(true, false);
  },

  /**
   * Called if a winner is determined in the checkWinner function. 
   * Emits the winner of the game for the server to see.
   */
  sendWinner(isPlayingAI, winner) {
    console.log("sendWinner called: ", winner);
    if (!isPlayingAI) {
      this.socket.emit('winner', winner);
    }
  },

  sendBoardUpdate(isPlayingAI, curState) {
    console.log("sendBoardUpdate Called. State is: ", curState)
    if (!isPlayingAI) {
      this.socket.emit('boardMove', curState);
    } else {
      this.makeAIMove(curState);
    }
  },

  /*
   * Called when the reset button is clicked. Sends a message to 
   * the server and clears the state of the game.
   */
  onReset(isPlayingAI){
    this.socket.emit('reset');
    this.resetBoard(false, isPlayingAI);
  }

}

export default connectionHelpers;