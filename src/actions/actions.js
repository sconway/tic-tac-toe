/*
 * Action Types
 */
export const MAKE_MOVE = 'MAKE_MOVE'
export const SET_PLAYER = 'SET_PLAYER'
export const CHANGE_TURN = 'CHANGE_TURN'

/*
 * Action Creators
 */

// move is an object containing the loction of the move
// and the player who made it.
export const makeMove = (move) => {
  return {
    type: MAKE_MOVE, 
    move
  }
}

export const setPlayer = (player) => {
  return {
    type: SET_PLAYER,
    player
  }
}

export const changeTurn = (turn) => {
  return {
    type: CHANGE_TURN,
    turn
  }
}
