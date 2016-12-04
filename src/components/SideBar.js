import React from 'react'

/**
 * Displays the current player's piece or a message if it has not
 * yet been assigned a piece.
 */
function PlayerInfo(props) {
  const player = props.player

  if (player) {
    return (<span className="player">{player}</span>)
  } else {
    return null;
  }
}

export default class SideBar extends React.Component {
  render() {
    return (
      <aside className="sidebar">
        <PlayerInfo player={this.props.player} />
      </aside>
    )
  }
}