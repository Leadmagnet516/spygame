import { useDispatch } from 'react-redux';
import {
  ACTION_TOGGLE_PAUSE,
  ACTION_CHANGE_GAME_STATE,
  GAME_STATE
} from '../CONSTANTS';

export default function ObjectiveCompleteModal(props) {
  const { handleLeaveGame } = props;
  const dispatch = useDispatch();

  const handleQuitClick = () => {
    dispatch({ type: ACTION_CHANGE_GAME_STATE, payload: GAME_STATE.LEAVING });
    handleLeaveGame();
  }

  return (
    <div className='modal pause-modal'>
      <div className='title'>
        <h2>OBJECTIVE COMPLETE!</h2>
      </div>
      <ul className='menu'>
        <li><button type='button' onClick={handleQuitClick}>Quit</button></li>
      </ul>
      
    </div>
  )
}