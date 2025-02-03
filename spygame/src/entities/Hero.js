import { useContext, useEffect } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON,
  ACTION_UPDATE_HERO_STATE
} from '../CONSTANTS';
import spySprite from '../images/spy.png'
import { AppContext } from '../App';
import useKeyboardControl from '../hooks/useKeyboardControls';
import useMouseAim from '../hooks/useMouseAim';
import useTickInterval from '../hooks/useTickInterval';
import useGridPosition from '../hooks/useGridPosition';
import { useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';
import { useDispatch } from 'react-redux';

export default function Hero(props, ref) {
  const { initPos, boundaryCollision, sceneryCollision, npcCollision } = props;
  const {xOffset, yOffset} = useContext(AppContext);
  const gameStateActive = useSelector(selectGameStateActive);
  const { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, spaceKeyDown } = useKeyboardControl();
  const { pos, updatePos } = useGridPosition('hero', initPos, [boundaryCollision, sceneryCollision, npcCollision]);
  const { aim, mouseDown } = useMouseAim(xOffset, yOffset, pos);
  const dispatch = useDispatch();

  const onTick = () => {
    if (!gameStateActive) return;
    let movement = {hor: 0, ver: 0};

    if (leftKeyDown) {
      movement.hor -= 1;
    }
    if (rightKeyDown) {
      movement.hor += 1;
    }
    if (upKeyDown) {
      movement.ver -= 1;
    }
    if (downKeyDown) {
      movement.ver += 1;
    }
 
    if (movement.hor !== 0 || movement.ver !== 0) {
      updatePos(movement)
    }
  }

  useTickInterval(onTick);

  useEffect(() => {
    onTick();
  }, [leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, spaceKeyDown]);

  useEffect(() => {
    if(mouseDown) {
      dispatchEvent(new CustomEvent(EVENT_FIRE_WEAPON, {detail: {pos, aim}}))
    }
  }, [mouseDown]);

  useEffect(() => {
    dispatch({ type: ACTION_UPDATE_HERO_STATE, payload: {pos}})
  }, [pos])

  return (
    <div className='entity hero' style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
    }}>
      <img src={spySprite} alt='hero' width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
}
