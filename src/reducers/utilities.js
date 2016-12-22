//
// Utility functions.
//

/*
 * Helper function that returns a random number between the two supplied
 * numbers. 
 *
 *  @param min  :  Integer
 *  @param max  :  Integer
 */
export const rando = (min, max) => {
  return Math.floor(Math.random() * (max - min) + min);
}

/**
 * Returns the next turn based on the supplied current turn.
 *
 * @param currentTurn : String
 */
export const nextTurn = (currentTurn) => {
  return (currentTurn === 'x' ? 'o' : 'x' );
}

/**
 * Simulates a player click using a very simple(dumb, naive, etc) AI
 *
 * @param     board : Array
 */
export const makeAIMove = (board) => {
  let boardLength = board.length;
  let player      = 'o';
  let moveIndex   = 0;

  do {
    moveIndex = rando(0, boardLength);

    // Only simulate the click on a space that doesn't have a piece placed
    if (board[moveIndex] === ' ') {
      return board.map((value, index) => {
        return (index === moveIndex ? player : value);
      });
    }

  } while (board[moveIndex] !== ' ');
}

/**
 * Checks the rows of the gameboard for a winning combination. Returns
 * the winning player(String), or 'd' if there is a draw.
 *
 * @param     board : Array
 * @param     turn  : String 
 */
export const getWinner = (board, turn) => {
  let moves     = board.join('').replace(/ /g,'');
  let topRow    = board[0] + board[1] + board[2];
  let middleRow = board[3] + board[4] + board[5];
  let bottomRow = board[6] + board[7] + board[8];
  let leftCol   = board[0] + board[3] + board[6];
  let middleCol = board[1] + board[4] + board[7];
  let rightCol  = board[2] + board[5] + board[8];
  let leftDiag  = board[0] + board[4] + board[8];
  let rightDiag = board[2] + board[4] + board[6];

  // Check for any winning combinations
  if (topRow.match(/xxx|ooo/)    || middleRow.match(/xxx|ooo/) ||
      leftCol.match(/xxx|ooo/)   || middleCol.match(/xxx|ooo/) ||
      rightCol.match(/xxx|ooo/)  || leftDiag.match(/xxx|ooo/)  ||
      rightDiag.match(/xxx|ooo/) || bottomRow.match(/xxx|ooo/)) {
    return turn;
  } else if (moves.length === 9) {
    return 'd';
  } else {
    return null;
  }
}
