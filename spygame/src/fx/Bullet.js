import { useEffect, useState } from 'react';
import {
  GRID_SIZE,
  EVENT_BULLET_COLLISION,
  ACTION_RECORD_ENTITY_DAMAGE,
  TICK_MS
} from '../CONSTANTS';
import { pixToPos } from '../METHODS';
import { useSelector } from 'react-redux';
import { selectGameStateActive } from '../SELECTORS';
import { useDispatch } from 'react-redux';
import useTickInterval from '../hooks/useTickInterval';

const BULLET_SPEED = 16;
const BULLET_DAMAGE = 25;

export default function Bullet(props) {
  let { initPos, id, aim, shooterId, boundaryCollision, sceneryCollision, entityCollision } = props;
  const [ loc, setLoc ] = useState({
    left: initPos.x * GRID_SIZE + GRID_SIZE / 2,
    top: initPos.y * GRID_SIZE + GRID_SIZE / 2
  })

  const gameStateActive = useSelector(selectGameStateActive);
  const dispatch = useDispatch();

  const onTick = () => { 
    if (!gameStateActive) return;
    const newLeft = loc.left + Math.cos(aim) * BULLET_SPEED;
    const newTop = loc.top + Math.sin(aim) * BULLET_SPEED;
    const pos = pixToPos({left: newLeft, top: newTop});
    const entityCollisionId = entityCollision(pos);
    
    if (entityCollisionId && entityCollisionId !== shooterId) {
      dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id, victimId: entityCollisionId, damage: BULLET_DAMAGE}}))
      dispatch({ type: ACTION_RECORD_ENTITY_DAMAGE, payload: {victimId: entityCollisionId, damage: BULLET_DAMAGE}})
      return() => {};
    }

    if (boundaryCollision(pos) || sceneryCollision(pos)) {
      dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id}}))
      return() => {};
    }

    setLoc({left: newLeft, top: newTop});
  }

  useTickInterval(onTick, TICK_MS)

  return (
    <div className='bullet' style={{
      left: `${loc.left}px`,
      top: `${loc.top}px`
    }}></div>
  );
}
