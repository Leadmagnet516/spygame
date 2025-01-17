import { useEffect, useState } from "react";
import {
  GRID_SIZE,
  EVENT_BULLET_COLLISION
 } from "../CONSTANTS";
import { pixToPos } from "../METHODS";

const BULLET_SPEED = 16;
const TICK_SPEED = 16;

export default function Bullet(props) {
  let { initPos, id, aim, boundaryCollision, sceneryCollision, enemyCollision } = props;
  const [ loc, setLoc ] = useState({
    left: initPos.x * GRID_SIZE + GRID_SIZE / 2,
    top: initPos.y * GRID_SIZE + GRID_SIZE / 2
  })

  useEffect(() => {
    const moveBullet = () => { 
      const newLeft = loc.left + Math.cos(aim) * BULLET_SPEED;
      const newTop = loc.top + Math.sin(aim) * BULLET_SPEED;
      const pos = pixToPos({left: newLeft, top: newTop});
      const enemyCollisionId = enemyCollision(pos);
      
      if (enemyCollisionId) {
        dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id, victimId: enemyCollisionId}}))
        return() => {};
      }

      if (boundaryCollision(pos) || sceneryCollision(pos)) {
        dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id}}))
        return() => {};
      }

      setLoc({left: newLeft, top: newTop});
    }

    setTimeout(moveBullet, TICK_SPEED);
  });

  return (
    <div className="bullet" style={{
      left: `${loc.left}px`,
      top: `${loc.top}px`
    }}></div>
  );
}
