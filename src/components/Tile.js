import React from 'react';

export default class Tile extends React.Component {
  tileClick(props) {
    // Make sure the move is on an empty space and it is the current player's turn
    if (props.gameBoard[props.loc] === ' ' && props.player === props.turn) {
      props.handleClick(props.gameBoard, props.loc, props.player, props.turn, props.isPlayingAI);
    }
  }

  render() {
    return (
      <div 
        className={"tile tile--" + this.props.loc + (this.props.value !== " " ? " has-value" : "")} 
        onClick={() => this.tileClick(this.props)}>
        <span 
          className="tile__content">
          {this.props.value}
        </span>
      </div>
    );
  }
}