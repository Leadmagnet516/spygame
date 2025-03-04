import { useContext, useEffect } from 'react';

export default function PauseModal(props) {
  const { splashToGame } = props;

  const handleAcceptClick = () => {
    splashToGame();
  }

  const handleOptionsClick = () => {

  }


  return (
    <div className='modal pause-modal'>
      <div className='title'>
        <h2>Welcome to</h2>
        <h1>SpyGame</h1>
        <span>v0.0.7</span>
      </div>
      <ul className='menu'>
        <li><button type='button' onClick={handleAcceptClick}>Accept Mission</button></li>
        <li><button type='button' onClick={handleOptionsClick}>Options</button></li>
      </ul>
      
    </div>
  )
}