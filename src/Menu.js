import React, { Component } from 'react';
import ResetButton from './ResetButton.js';

export default class Menu extends Component {

  render() {
    return(
      <div className="menu">
        <h1 className="title">Tic React Toe</h1>
        <ResetButton 
          inAnnouncement={false}
          reset={this.props.reset} />
      </div>
    );
  }

}
