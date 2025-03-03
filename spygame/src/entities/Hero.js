import { useContext, useEffect } from 'react';
import {
  GRID_SIZE,
  EVENT_FIRE_WEAPON,
  EVENT_HERO_INTERACT,
  ACTION_UPDATE_HERO_STATE,
  HERO_MOVE_MS
} from '../CONSTANTS';
import { AppContext } from '../App';
import useKeyboardControl from '../hooks/useKeyboardControls';
import useMouseAim from '../hooks/useMouseAim';
import useTickInterval from '../hooks/useTickInterval';
import useGridPosition from '../hooks/useGridPosition';
import { useState } from 'react';
import { selectGameStateActive } from '../SELECTORS';
import { useDispatch,useSelector } from 'react-redux';

import spy_n2 from '../images/spy_-2.png';
import spy_n1 from '../images/spy_-1.png';
import spy_0 from '../images/spy_0.png';
import spy_p1 from '../images/spy_1.png';
import spy_p2 from '../images/spy_2.png';

export default function Hero(props, ref) {
  const { initPos, damageTaken, alive, boundaryCollision, sceneryCollision, npcCollision } = props;
  const {xOffset, yOffset} = useContext(AppContext);
  const gameStateActive = useSelector(selectGameStateActive);
  const { leftKeyDown, rightKeyDown, upKeyDown, downKeyDown, spaceKeyDown } = useKeyboardControl();
  const { pos, updatePos } = useGridPosition('hero', initPos, [boundaryCollision, sceneryCollision, npcCollision]);
  const { aim, mouseDown } = useMouseAim(xOffset, yOffset, pos);
  const dispatch = useDispatch();
  const [ flash, setFlash ] = useState(false);
  const [ showSprite, setShowSprite ] = useState(0);

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
    if(gameStateActive && mouseDown && alive) {
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

  useEffect(() => {
    setShowSprite(Math.round(aim * (4 / Math.PI)));
  }, [aim])

  return (
    <div className='entity hero' style={{
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      filter: `brightness(${flash ? '1.5' : '1'})`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`
    }}>
      <img src={spy_0} alt='hero' width={64} height={48} style={{display: showSprite === -4 ? 'block' : 'none', transform: 'scaleX(-1) translateX(16px)'}}></img>
      <img src={spy_n1} alt='hero' width={64} height={48} style={{display: showSprite === -3 ? 'block' : 'none', transform: 'scaleX(-1) translateX(16px)'}}></img>
      <img src={spy_n2} alt='hero' width={64} height={48} style={{display: showSprite === -2 ? 'block' : 'none'}}></img>
      <img src={spy_n1} alt='hero' width={64} height={48} style={{display: showSprite === -1 ? 'block' : 'none'}}></img>
      <img src={spy_0} alt='hero' width={64} height={48} style={{display: showSprite === 0 ? 'block' : 'none'}}></img>
      <img src={spy_p1} alt='hero' width={64} height={48} style={{display: showSprite === 1 ? 'block' : 'none'}}></img>
      <img src={spy_p2} alt='hero' width={64} height={48} style={{display: showSprite === 2 ? 'block' : 'none'}}></img>
      <img src={spy_p1} alt='hero' width={64} height={48} style={{display: showSprite === 3 ? 'block' : 'none', transform: 'scaleX(-1) translateX(16px)'}}></img>
      <img src={spy_0} alt='hero' width={64} height={48} style={{display: showSprite === 4 ? 'block' : 'none', transform: 'scaleX(-1) translateX(16px)'}}></img>
    </div>
  );
}
