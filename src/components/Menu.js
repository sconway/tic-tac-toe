import React, { Component } from 'react';
import ResetButton from './ResetButton.js';

function TurnInfo(props) {
  const turn   = props.turn
  const player = props.player

  if (turn === player) {
    return (<p className="turn-text" >It is your turn to make a move.</p>)
  } else {
    return (<p className="turn-text" >Waiting for the other player to go...</p>)
  }
}

export default class Menu extends Component {

  render() {
    return(
      <div className="menu">
        <TurnInfo  player={this.props.player} turn={this.props.turn} />
      </div>
    );
  }

}
