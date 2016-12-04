import React from 'react';

export default class ReconnectButton extends React.Component {

  render() {
    if (this.props.isPlayerIdle) {
      return (
        <button 
          className='btn btn--reset__announcement'
          onClick={this.props.reconnectPlayer} >
          Reconnect
        </button>
      );
    } else {
      return null;
    }
  }

}