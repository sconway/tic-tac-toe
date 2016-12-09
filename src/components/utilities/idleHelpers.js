
let idleHelpers = {
	
  removeListeners() {
    console.log("removing idle listeners")
    document.getElementById('root').removeEventListener("mousemove", this.timerReset, false);
    document.getElementById('root').removeEventListener("touchstart", this.timerReset, false);
    document.getElementById('root').removeEventListener("MSPointerMove", this.timerReset, false);
    window.clearInterval(this.timeoutID);
  },

  setupIdleTimer() {
    document.getElementById('root').addEventListener("mousemove", this.timerReset, false);
    document.getElementById('root').addEventListener("touchstart", this.timerReset, false);
    document.getElementById('root').addEventListener("MSPointerMove", this.timerReset, false);
    this.startIdleTimer();
  },

  startIdleTimer() {
    this.timeoutID = window.setTimeout(this.goInactive.bind(this), 100000);
  },

  resetTimer() {
    if (this.timeoutID) {
      window.clearInterval(this.timeoutID);
      this.goActive();
    }
  },
   
  goInactive() {
    if (this.socket) {
      this.socket.disconnect();
      this.removeListeners();
      this.matchFound = null;
      this.player     = null
      this.setState({ 
        isWaiting:    true,
        isPlayerIdle: true
      });      
    }
  },
   
  goActive() {
    this.startIdleTimer();
  }

}

export default idleHelpers;
