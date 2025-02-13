import { useContext, useEffect } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON,
  EVENT_HERO_INTERACT,
  ACTION_UPDATE_HERO_STATE,
  HERO_MOVE_MS
} from '../CONSTANTS';
import spySprite from '../images/spy.png'
import { AppContext } from '../App';
import useKeyboardControl from '../hooks/useKeyboardControls';
import useMouseAim from '../hooks/useMouseAim';
import useTickInterval from '../hooks/useTickInterval';
import useGridPosition from '../hooks/useGridPosition';
import { useState } from 'react';
import { selectGameStateActive } from '../SELECTORS';
import { useDispatch,useSelector } from 'react-redux';

export default function Hero(props, ref) {
  const { initPos, damageTaken, alive, boundaryCollision, sceneryCollision, npcCollision } = props;
  const {xOffset, yOffset} = useContext(AppContext);
  const gameStateActive = useSelector(selectGameStateActive);
  const { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, spaceKeyDown } = useKeyboardControl();
  const { pos, updatePos } = useGridPosition('hero', initPos, [boundaryCollision, sceneryCollision, npcCollision]);
  const { aim, mouseDown } = useMouseAim(xOffset, yOffset, pos);
  const dispatch = useDispatch();
  const [ flash, setFlash ] = useState(false);

  const onMoveTick = () => {
    if (!gameStateActive || !alive) return;

    // MOVEMENT
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

  useTickInterval(onMoveTick, HERO_MOVE_MS);

  const handleHit = () => {
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 50);
  }

  useEffect(() => {
    if (!alive) return;
    // TODO: Make hero's speed more consistent
    onMoveTick();
  }, [leftKeyDown, rightKeyDown, upKeyDown, downKeyDown]);

  useEffect(() => {
    if(mouseDown && alive) {
      dispatchEvent(new CustomEvent(EVENT_FIRE_WEAPON, {detail: {pos, aim, shooterId: 'hero'}}))
    }
  }, [mouseDown]);

  useEffect(() => {
    if(spaceKeyDown && alive) {
      dispatchEvent(new CustomEvent(EVENT_HERO_INTERACT, { detail: {pos, aim}}))
    }
  }, [spaceKeyDown]);

  useEffect(() => {
    dispatch({ type: ACTION_UPDATE_HERO_STATE, payload: {pos}})
  }, [pos])

  useEffect(() => {
    if(!alive) {
      return(() => {})
    }
    handleHit();
  }, [damageTaken, alive])

  return (
    <div className='entity hero' style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      filter: `brightness(${flash ? '1.5' : '1'})`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`
    }}>
      <img src={spySprite} alt='hero' width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
}
