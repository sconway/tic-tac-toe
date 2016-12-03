import React from 'react'
import Tile from "./Tile.js"

export default class Board extends React.Component {
	render() {
		return (
			<div className='board'>
        {this.props.gameBoard.map((value, i) => {
          return (
            <Tile
              key        ={i}
              loc        ={i}
              value      ={value}
              player     ={this.props.player}
              isPlayingAI={this.props.isPlayingAI}
              handleClick={this.props.handleClick}
              turn       ={this.props.turn} />
          );
        })}
      </div>
		)
	}
}