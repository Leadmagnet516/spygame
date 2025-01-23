import {
  GRID_SIZE } from "../CONSTANTS";
import { randomIntBetween } from "../METHODS";
import { useEffect, useState } from "react";
import enemySprite from '../images/enemy.png'

const ENEMY_TICK_DURATION = 1000;
const LETHARGY = 2;
const BASE_HITPOINTS = 100;

export default function Enemy(props) {
  const { initPos, id, damageTaken, boundaryCollision, sceneryCollision, handleNpcMoved, handleNpcDead} = props;
  const [ alive, setAlive ] = useState(true);
  const [ pos, setPos ] = useState(initPos);
  const [ flash, setFlash ] = useState(false);
  const [ health, setHealth ] = useState(BASE_HITPOINTS);
  const [ intervalId, setIntervalId ] = useState(0);
  const [ damageTotal, setDamageTotal ] = useState(0);

  const updatePos = (h = 0, v = 0) => {
    const newPos =  {x: pos.x + h, y: pos.y + v};
    if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
      setPos(newPos);
      handleNpcMoved(id, newPos);
    }
  }

  const handleHit = damage => {
    setHealth(health - damage);
    if(health <= 0) {
      setAlive(false);
    }
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

  if(!intervalId) {
    setIntervalId(setInterval(moveSelf, ENEMY_TICK_DURATION));
  }

  useEffect(() => {
    if(!alive) {
      handleNpcDead(id);
      clearInterval(intervalId);
      return(() => {})
    }
    
  }, [alive])

  useEffect(() => {
    if (alive && damageTaken > damageTotal) {
      handleHit(20);
      setDamageTotal(damageTaken);
    }
  }, [damageTaken])

  return (
    <div className="enemy" style={{
      width: `${GRID_SIZE}px`,
      height: `${GRID_SIZE}px`,
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      filter: `${flash ? 'brightness(1.5)' : 'none'}`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`,
    }}>
      <img src={enemySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
    </div>
  );
}
