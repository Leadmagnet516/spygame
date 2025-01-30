import { useContext, useEffect, useState } from "react";
import {
  GRID_SIZE,
  EVENT_BULLET_COLLISION
} from "../CONSTANTS";
import { pixToPos } from "../METHODS";
import { GameContext } from "../screens/GameScreen";

const BULLET_SPEED = 16;
const TICK_DURATION = 16;
const BULLET_DAMAGE = 25;

export default function Bullet(props) {
  let { initPos, id, aim, boundaryCollision, sceneryCollision, entityCollision } = props;
  const [ loc, setLoc ] = useState({
    left: initPos.x * GRID_SIZE + GRID_SIZE / 2,
    top: initPos.y * GRID_SIZE + GRID_SIZE / 2
  })

  const { gameStateActive } = useContext(GameContext);

  useEffect(() => {
    if (!gameStateActive) return;

    const moveBullet = () => { 
      const newLeft = loc.left + Math.cos(aim) * BULLET_SPEED;
      const newTop = loc.top + Math.sin(aim) * BULLET_SPEED;
      const pos = pixToPos({left: newLeft, top: newTop});
      const entityCollisionId = entityCollision(pos);
      
      if (entityCollisionId) {
        dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id, victimId: entityCollisionId, damage: BULLET_DAMAGE}}))
        return() => {};
      }

      if (boundaryCollision(pos) || sceneryCollision(pos)) {
        dispatchEvent(new CustomEvent(EVENT_BULLET_COLLISION, {detail: {bulletId: id}}))
        return() => {};
      }

      setLoc({left: newLeft, top: newTop});
    }

    setTimeout(moveBullet, TICK_DURATION);
  });

  return (
    <div className="bullet" style={{
      left: `${loc.left}px`,
      top: `${loc.top}px`
    }}></div>
  );
}
