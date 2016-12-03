import React, { Component } from 'react';
import ResetButton from './ResetButton.js';
import AIButton from './AIButton.js';


/*
 * Returns one of two messages depending on if a player has disconnected
 */
function DidDisconnect(props) {
  const disconnect = props.disconnect

  if (disconnect) {
    return (
      <h2 className="announcement__winner">
         Other Player disconnected
      </h2>
    )
  } else {
    return (
      <h2 className="announcement__message">
         Tic Tac Toe
      </h2>
    )
  }
}

/*
 * Returns one of a few possible submessages depending on if the other
 * player has been found.
 */
function GetSubMessage(props) {
  const matchFound = props.matchFound
  
  if (matchFound) {
    return (
      <h3 className="announcement__sub-message">
         Second player has been found
      </h3>
    )
  } else {
    return (
      <h3 className="announcement__sub-message">
         Waiting on a second player
      </h3>
    )
  }
}


/*
 * Returns one of a few possible submessages depending on if the player
 * has been assigned a game piece yet.
 */
function PlayerMessage(props) {
  const player = props.player

  if (player) {
    return (
      <h3 className="announcement__sub-message">
        Your piece is: {player}
      </h3>
    )
  } else {
    return null
  }
}


/*
 * Returns one of a few possible submessages depending on if the player
 * has been assigned a game piece yet.
 */
function WinnerMessage(props) {
  const winner = props.winner

  if (winner === 'd') {
    return (
      <h3 className="announcement__winner">
        It is a draw
      </h3>
    )
  } else {
    return (
      <h3 className="announcement__winner">
        The winner is: {winner}
      </h3>
    )
  }
}

/*
 * Returns one of two different announcements based on the supplied props.
 * If we are still waiting for a player, a waiting screen is displayed, 
 * otherwise it means the game has ended.
 *
 * @param  props : object
 */
function GetAnnouncement(props) {
  const isWaiting  = props.isWaiting
  const winner     = props.winner
  const onReset      = props.onReset
  const player     = props.player
  const matchFound = props.matchFound
  const disconnect = props.disconnect
  const playAI     = props.playAI
  const isPlayingAI = props.isPlayingAI

  if (isWaiting) {
    return (
      <aside className="announcement__content">
        <DidDisconnect disconnect={disconnect} />
        <GetSubMessage matchFound={matchFound} />
        <PlayerMessage player={player} />
        <AIButton playAI={playAI} />
      </aside>
    )
  } else if (winner) {
    return (
      <aside className="announcement__content">
        <h2 className="announcement__message">Game Over</h2>
        <WinnerMessage winner={winner} />
        <ResetButton onReset={onReset} isPlayingAI={isPlayingAI} />
      </aside>
    )
  } else {
    return null
  }
}

export default class Announcement extends Component {

  render() {
    return(
      <section className={"announcement " + (this.props.winner || this.props.isWaiting ? "visible" : "hidden" )}>
      	<GetAnnouncement 
          player     ={this.props.player} 
          isWaiting  ={this.props.isWaiting} 
          matchFound ={this.props.matchFound}
          disconnect ={this.props.disconnect}
          onReset    ={this.props.onReset} 
          winner     ={this.props.winner} 
          isPlayingAI={this.props.isPlayingAI}
          playAI     ={this.props.playAI} />
      </section>
    )
  }

}