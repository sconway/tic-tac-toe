import React from 'react';

export default class AIButton extends React.Component {
	
  render() {
    return (
      <button 
      	className='btn btn--reset__announcement'
      	onClick={this.props.playAI} >
      	Play Computer Instead
      </button>
    )
  }

}