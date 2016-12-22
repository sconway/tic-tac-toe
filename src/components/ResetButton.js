import React from 'react';

export default class ResetButton extends React.Component {
  resetClick(props) {
    console.log("Reset Button Clicked. Props are: ", props);
  	props.onReset(props.isPlayingAI);
  }

  render() {
    return (
      <button 
      	className='btn btn--reset__announcement'
      	onClick={() => this.resetClick(this.props)} >
      	Reset
      </button>
    )
  }

}