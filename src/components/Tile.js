import React from 'react';

export default class Tile extends React.Component {
  tileClick(props) {
    props.handleClick(props.loc, props.player, props.isPlayingAI);
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