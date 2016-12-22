import * as utils from './utilities';

const initialState = {
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

// Utility to create a new state object.
const updateObject = (oldObject, newValues) => {
  return Object.assign({}, oldObject, newValues);
}

// Reducer for when a move is made.
const moveMade = (state, action) => {
  let board  = state.gameBoard.map((value, index) => {
                return (index === action.move.index) ? action.move.player : value;
              });
  let turn   = utils.nextTurn(state.turn);
  let winner = utils.getWinner(board, state.turn);

  if (!winner) {

    // If we're playing the computer, do another check for the
    // winner after the computer makes its move.
    if (action.move.isPlayingAI) {

      let AIBoard  = utils.makeAIMove(board);

      return updateObject(state, {
        gameBoard: AIBoard,
        turn: state.turn,
        winner: utils.getWinner(AIBoard, turn)
      });

    } else {

      // We are not playing the computer, so update normally
      return updateObject(state, {
        gameBoard: board, 
        turn: turn
      });

    }

  } else {

    // Update the board with the new winner.
    return updateObject(state, {
      gameBoard: board,
      winner: winner
    });

  }
}

// Reducer for when a player connects.
const playerConnected = (state, action) => {
  return updateObject(state, {
    player: action.player,
    matchFound: action.player === 'o'
  });
}

// Reducer for when a player disconnects.
const playerDisconnected = (state, action) => {
  return updateObject(state, {
    playerDisconnect: true
  })
}

// Reducer for when a player match has been found.
const foundMatch = (state, action) => {
  return updateObject(state, {
    matchFound: true,
    player: 'x'
  });
}

// Reducer for when a player stops waitiing.
const stoppedWaiting = (state, action) => {
  return updateObject(state, {
    isWaiting: state.matchFound ? false : state.playerDisconnect
  });
}

// Reducer for when the board is cleared.
const boardCleared = (state, action) => {
  let op     = action.options;
  let player = (op.didPlayerDisconnect || op.isPlayerIdle) ? 
                null : (op.isPlayingAI ? 'x' : state.player);

  return updateObject(initialState, {
    isWaiting:           op.isWaiting,
    isPlayingAI:         op.isPlayingAI,
    player:              player,
    playerDisconnect:    op.didPlayerDisconnect,
    isPlayerIdle:        op.isPlayerIdle,
  });
}

// Main reducer for the game.
const gameReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'MOVE_MADE':           return moveMade(state, action);
    case 'PLAYER_CONNECTED':    return playerConnected(state, action);
    case 'PLAYER_DISCONNECTED': return playerDisconnected(state, action);
    case 'FOUND_MATCH':         return foundMatch(state, action);
    case 'STOPPED_WAITING':     return stoppedWaiting(state, action);
    case 'BOARD_CLEARED':       return boardCleared(state, action);
    default:                    return state;
  }
}

export default gameReducer;
