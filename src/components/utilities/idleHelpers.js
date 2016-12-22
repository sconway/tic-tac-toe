//
// Helper functions for checking and responding to inactive players.
//

const DELAY      = 90000; // 1.5 minute inactivity limit
let timeoutID    = null;	
let socket       = null;
let boardCleared = null;


// Sets up the idle listeners and kicks off the timer.
export const setupIdleTimer = (sock, callback) => {
  socket       = sock;
  boardCleared = callback;
  document.getElementById('root').addEventListener("mousemove", resetTimer, false);
  document.getElementById('root').addEventListener("touchstart", resetTimer, false);
  document.getElementById('root').addEventListener("MSPointerMove", resetTimer, false);
  startIdleTimer();
}

// Removes the listeners once the player has gone idle 
export const removeListeners = () => {
  document.getElementById('root').removeEventListener("mousemove", resetTimer, false);
  document.getElementById('root').removeEventListener("touchstart", resetTimer, false);
  document.getElementById('root').removeEventListener("MSPointerMove", resetTimer, false);
  window.clearInterval(timeoutID);
}

// Sets our idle timer.
export const startIdleTimer = () => {
  timeoutID = window.setTimeout(goInactive, DELAY);
}

// Resets and restarts the timer every time the user moves.
export const resetTimer = () => {
  if (timeoutID) {
    window.clearInterval(timeoutID);
    startIdleTimer();
  }
}

// Called when the player has been idle for more
// than the specified amount of time. 
export const goInactive = () => {

  if (socket) {
    socket.disconnect();

    removeListeners();

    boardCleared(true, false, false, true);
  }

}
