import { useDispatch } from 'react-redux';
import {
  ACTION_TOGGLE_PAUSE,
  ACTION_CHANGE_GAME_STATE,
  GAME_STATE
} from '../CONSTANTS';

export default function PauseModal(props) {
  const { handleLeaveGame } = props;
  const dispatch = useDispatch();

  const handleResumeClick = () => {
    dispatch({type: ACTION_TOGGLE_PAUSE});
  }

  const handleQuitClick = () => {
    dispatch({ type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.LEAVING });
    handleLeaveGame();
  }

  return (
    <div className='modal pause-modal'>
      <div className='title'>
        <h2>GAME PAUSED</h2>
      </div>
      <ul className='menu'>
        <li><button type='button' onClick={handleResumeClick}>Back to Game</button></li>
        <li><button type='button' onClick={handleQuitClick}>Quit</button></li>
      </ul>
      
    </div>
  )
}