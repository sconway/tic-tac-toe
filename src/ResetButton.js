import React from 'react';

export default class ResetButton extends React.Component {

  render() {
    return (
      <button 
      	className={'btn btn--reset ' + (this.props.inAnnouncement ? 'btn--reset__announcement' : '')} 
      	onClick={this.props.reset} >
      	Reset
      </button>
    )
  }
}