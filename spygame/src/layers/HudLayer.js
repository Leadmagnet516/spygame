import {
  GAME_WIDTH,
  GAME_HEIGHT
} from '../CONSTANTS';
import { selectGameStateActive } from '../SELECTORS';
import { useSelector } from 'react-redux';

export default function HudLayer(props) {
  const gameStateActive = useSelector(selectGameStateActive);

  return (
    <div className='hud-layer' style={{
      width: `${GAME_WIDTH}px`,
      height: `${GAME_HEIGHT}px`,
      position: 'absolute'
    }}>
      <div className='top right'>
        <div className="description">[ WASD ] Movement &nbsp;&nbsp;&nbsp;&nbsp;[ Mouse ] Aim + Fire</div>
      </div>
      <div className='bottom left'>
        <div className="description" style={{ display: gameStateActive ? 'block' : 'none'}}>[ Esc ] Pause</div>
        <div className="description" style={{ display: gameStateActive ? 'none' : 'block'}}>[ Esc ] Resume</div>
      </div>
      { props.children}
    </div>
  );
}
