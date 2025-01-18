import { EVENT_BULLET_HIT_ENEMY, EVENT_NPC_MOVED, GRID_SIZE } from "../CONSTANTS";
import { randomIntBetween } from "../METHODS";
import { useEffect, useState } from "react";
import enemySprite from '../images/enemy.png'

const ENEMY_TICK_DURATION = 100;
const LETHARGY = 2;
const BASE_HITPOINTS = 100;

export default function Enemy(props) {
  const { initPos, id, boundaryCollision, sceneryCollision} = props;
  const [ pos, setPos ] = useState(initPos);
  const [ flash, setFlash ] = useState(false);
  const [ health, setHealth ] = useState(BASE_HITPOINTS);

  const updatePos = (h = 0, v = 0) => {
    const newPos =  {x: pos.x + h, y: pos.y + v};
    if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
      setPos(newPos);
      reportPosition(newPos);
    }
  }

  const hitByBullet = damage => {
    setHealth(health - damage);
    if(health <= 0) console.log(`Enemy ${id} has died.`)
    setFlash(true);
    setTimeout(() => {
      setFlash(false);
    }, 50);
  }

  const moveSelf = () => {
    if(Math.random() * LETHARGY < 1) {
      updatePos(randomIntBetween(-1, 1), randomIntBetween(-1, 1));
    }
  }

  const reportPosition = pos => {
    dispatchEvent(new CustomEvent(EVENT_NPC_MOVED, {detail: {id, pos}}));
  }

  useEffect(() => {
    setTimeout(moveSelf, ENEMY_TICK_DURATION);

    const handleBulletHitEnemy = e => {
      const { victimId, damage } = e.detail;
      if (victimId === id) {
        hitByBullet(damage);
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
      /* backgroundColor: `${flash ? '#fff' : 'transparent'}`,
      opacity: `${health / 100 * .5 + .5}` */
      filter: `${flash ? 'brightness(1.5)' : 'none'}`
    }}>
      <img src={enemySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
}
