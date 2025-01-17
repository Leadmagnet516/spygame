import { EVENT_BULLET_HIT_ENEMY, EVENT_NPC_MOVED, GRID_SIZE } from "../CONSTANTS";
import { randomIntBetween } from "../METHODS";
import { useEffect, useState } from "react";

const ENEMY_TICK_SPEED = 2000;
const LETHARGY = 2;

export default function Enemy(props) {
  const { initPos, id, boundaryCollision, sceneryCollision} = props;
  const [ pos, setPos ] = useState(initPos);
  const [ flash, setFlash ] = useState(false);

  const updateLoc = (h = 0, v = 0) => {
    const newPos =  {x: pos.x + h, y: pos.y + v};
    if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
      setPos(newPos);
      reportPosition(newPos);
    }
  }

  const hitByBullet = () => {
    console.log(`Oh no! Enemy ${id} has been hit by a bullet!`);
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 100);
  }

  const moveSelf = () => {
    if(Math.random() * LETHARGY < 1) {
      updateLoc(randomIntBetween(-1, 1), randomIntBetween(-1, 1));
    }
  }

  const reportPosition = pos => {
    dispatchEvent(new CustomEvent(EVENT_NPC_MOVED, {detail: {id, pos}}));
  }

  useEffect(() => {
    setTimeout(moveSelf, ENEMY_TICK_SPEED);

    const handleBulletHitEnemy = e => {
      if (e.detail.id === id) {
        hitByBullet();
      }
    }

    window.addEventListener(EVENT_BULLET_HIT_ENEMY, handleBulletHitEnemy);
    return (() => {
      window.removeEventListener(EVENT_BULLET_HIT_ENEMY, handleBulletHitEnemy);
    })
  })

  return (
    <div className="enemy" style={{
      width: `${GRID_SIZE}px`,
      height: `${GRID_SIZE}px`,
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      backgroundColor: `${flash ? '#fff' : '#f00'}`
    }}></div>
  );
}
