import { useEffect, useState } from "react";
import { GRID_SIZE } from "../CONSTANTS";
import { pixToPos } from "../METHODS";

const BULLET_SPEED = 10;
const TICK_SPEED = 5;

export default function Bullet(params) {
  let { initPos, id, aim, boundaryCollision, sceneryCollision, enemyCollision } = params;
  const [ loc, setLoc ] = useState({
    left: initPos.x * GRID_SIZE + GRID_SIZE / 2,
    top: initPos.y * GRID_SIZE + GRID_SIZE / 2
  })
  const [ visibility, setVisibility ] = useState("visible");

  useEffect(() => {
    const moveBullet = () => {
      const newLeft = loc.left + Math.cos(aim) * BULLET_SPEED;
      const newTop = loc.top + Math.sin(aim) * BULLET_SPEED;
      const pos = pixToPos({left: newLeft, top: newTop});
      if (boundaryCollision(pos)) {
        console.log(`Bullet ${id} has gone out of bounds`);
        setVisibility("hidden");
        return() => {}
      }
      if (sceneryCollision(pos)) {
        console.log(`Bullet ${id} has hit a piece of scenery`);
        setVisibility("hidden");
        return() => {}
      }
      if (enemyCollision(pos)) {
        console.log(`Bullet ${id} has hit an enemy`);
        setVisibility("hidden");
        return() => {}
      }
      setLoc({left: newLeft, top: newTop});
    }

    setTimeout(moveBullet, TICK_SPEED);
  });

  return (
    <div className="bullet" style={{
      left: `${loc.left}px`,
      top: `${loc.top}px`,
      visibility: {visibility}
    }}></div>
  );
}
