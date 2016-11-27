import React from 'react'

function PlayerInfo(props) {
  const player = props.player

  if (!player) {
    return (<span className="player">You have not been assigned a piece yet :(</span>)
  } else {
    return (<span className="player">{player}</span>)
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