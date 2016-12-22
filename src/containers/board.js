import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { moveMade } from '../actions/index';
import Tile from '../components/Tile';


class Board extends Component {
  
  render() {
  	return (
  		<div className='board'>
        {this.props.gameBoard.map((value, i) => {
          return (
            <Tile
              key        ={i}
              loc        ={i}
              value      ={value}
              gameBoard  ={this.props.gameBoard}
              player     ={this.props.player}
              isPlayingAI={this.props.isPlayingAI}
              handleClick={this.props.handleClick}
              turn       ={this.props.turn} />
          );
        })}
      </div>
  	);
  }

};

// Give this container access to the gameBoard in the store
const mapStateToProps = (state) => {
	console.log("in mapStateToProps, state is: ", state.GameReducer);
	return {
		gameBoard:   state.GameReducer.gameBoard
	}
};

const mapDispatchToProps = (dispatch) => {
	return bindActionCreators({
		moveMade
	}, dispatch);
};

export default connect(mapStateToProps, mapDispatchToProps)(Board);
