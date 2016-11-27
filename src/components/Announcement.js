import React, { Component } from 'react';
import ResetButton from './ResetButton.js';

/*
 * Returns one of two different announcements based on the supplied props.
 * If we are still waiting for a player, a waiting screen is displayed, 
 * otherwise it means the game has ended.
 *
 * @param  props : object
 */
function GetAnnouncement(props) {
  const isWaiting = props.isWaiting
  const winner = props.winner
  const reset = props.reset
  const player = props.player
  const matchFound = props.matchFound

  if (isWaiting) {
    return (
      <aside className="announcement__content">
        <h2 className="announcement__message">Welcome</h2>
        <h3 className="announcement__sub-message">
          { !matchFound ? "Waiting on a second player" : "Second player has been found" }
        </h3>
        <h3 className="announcement__sub-message">{player ? ("Your piece is: " + player) : ""}</h3>
      </aside>
    )
  } else if (winner) {
    return (
      <aside className="announcement__content">
        <h2 className="announcement__message">Game Over</h2>
        <p className="announcement__winner"> 
          { winner === "d" ? "It's a draw!" : "The winner is: " + winner }
        </p>
        <ResetButton inAnnouncement={true} reset={reset} />
      </aside>
    )
  } else {
    return null;
  }
}

export default class Announcement extends Component {

  render() {
    return(
      <section className={"announcement " + (this.props.winner || this.props.isWaiting ? "visible" : "hidden" )}>
      	<GetAnnouncement 
          player={this.props.player} 
          isWaiting={this.props.isWaiting} 
          matchFound={this.props.matchFound}
          reset={this.props.reset} 
          winner={this.props.winner} />
      </section>
    )
  }

}