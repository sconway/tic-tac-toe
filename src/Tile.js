import React from 'react';

export default class Tile extends React.Component {
  tileClick(props) {
    props.handleClick(props.loc, props.turn);
  }

  render() {
    return (
      <div className={"tile " + this.props.loc} onClick={() => this.tileClick(this.props)}>
        <span className="tile__content">{this.props.value}</span>
      </div>
    );
  }
}