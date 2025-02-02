import {
  GAME_WIDTH,
  GAME_HEIGHT,
  EVENT_OPEN_MODAL,
  ACTION_CHANGE_GAME_STATE,
  GAME_STATE
} from '../CONSTANTS';
import { selectGameStateActive } from '../SELECTORS';
import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

export default function HudLayer(props) {
  const dispatch = useDispatch();
  const gameStateActive = useSelector(selectGameStateActive);

  const handleInventoryClick = e => {
    dispatchEvent(new CustomEvent(EVENT_OPEN_MODAL, {detail: { modalPurpose: 'inventory' }}));
  }

  const handlePauseClick = () => {
    dispatchPause();
  }

  const handleResumeClick = () => {
    dispatchResume();
  }

  const dispatchPause = () => {
    dispatch({type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.PAUSED});
  }

  const dispatchResume = () => {
    dispatch({type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.ACTIVE});
  }

  const handleKeyDown = e => {
    if (e.key === 'Escape') {
      if(gameStateActive) {
        dispatchPause();
      } else {
        dispatchResume();
      }
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    }
  })

  return (
    <div className='hud-layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
      <div className='top left'></div>
      <div className='top right'>
        <button type='button' onClick={handleInventoryClick}>Inventory</button>
        <button type='button' onClick={handlePauseClick} style={{ display: gameStateActive ? 'block' : 'none'}}>Pause</button>
        <button type='button' onClick={handleResumeClick} style={{ display: gameStateActive ? 'none' : 'block'}}>Resume</button>
      </div>
      <div className='bottom left'></div>
      <div className='bottom right'></div>
    </div>
  );
}
