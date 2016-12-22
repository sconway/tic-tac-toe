/*
 * Action Types
 */
export const MOVE_MADE     = 'MOVE_MADE'
export const COMPUTER_MOVE_MADE = 'COMPUTER_MOVE_MADE'
export const FOUND_MATCH   = 'FOUND_MATCH'
export const BOARD_CLEARED = 'BOARD_CLEARED'
export const PLAYER_CONNECTED = 'PLAYER_CONNECTED'
export const PLAYER_DISCONNECTED = 'PLAYER_DISCONNECTED'
export const STOPPED_WAITING = 'STOPPED_WAITING'

/*
 * Action Creators
 */

// move is an object containing the loction of the move
// and the player who made it.
export const moveMade = (move) => {
  return {
    type: MOVE_MADE, 
    move
  }
}

export const computerMoveMade = () => {
  return {
    type: COMPUTER_MOVE_MADE
  }
}

export const foundMatch = () => {
  return {
    type: FOUND_MATCH
  }
}

export const boardCleared = (options) => {
  return {
    type: BOARD_CLEARED,
    options
  }
}

export const playerConnected = (player) => {
  return {
    type: PLAYER_CONNECTED,
    player
  }
}

export const playerDisconnected = () => {
  return {
    type: PLAYER_DISCONNECTED
  }
}

export const stoppedWaiting = () => {
  return {
    type: STOPPED_WAITING
  }
}