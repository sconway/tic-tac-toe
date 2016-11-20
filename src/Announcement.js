import React, { Component } from 'react';
import ResetButton from './ResetButton.js';

export default class Announcement extends Component {

  render() {
    return(
      <section className={'announcement ' + (this.props.winner ? 'visible' : 'hidden' )}>
      	<aside className='announcement__content'>
	        <h2 className='announcement__message'>Game Over</h2>
	        <ResetButton inAnnouncement={true} reset={this.props.reset}/>
	      </aside>
      </section>
    )
  }

}