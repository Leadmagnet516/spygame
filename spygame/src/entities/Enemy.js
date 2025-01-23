import {
  GRID_SIZE,
  ENTITY_UPDATE,
  ENTITY_MOOD
 } from "../CONSTANTS";
import { randomIntBetween } from "../METHODS";
import { useEffect, useState } from "react";
import enemySprite from '../images/enemy.png'

const ENEMY_TICK_DURATION = 1000;
const LETHARGY = 2;
const BASE_HITPOINTS = 100;

export default function Enemy(props) {
  const { npc, damageTaken, boundaryCollision, sceneryCollision, updateFromNpc } = props;
  const { id, fov, mood } = npc;
  const [ alive, setAlive ] = useState(true);
  const [ pos, setPos ] = useState(npc.pos);
  const [ flash, setFlash ] = useState(false);
  const [ health, setHealth ] = useState(BASE_HITPOINTS);
  const [ intervalId, setIntervalId ] = useState(0);
  const [ damageTotal, setDamageTotal ] = useState(0);

  const updatePos = (h = 0, v = 0) => {
    const newPos =  {x: pos.x + h, y: pos.y + v};
    if(!boundaryCollision(newPos) && !sceneryCollision(newPos)) {
      setPos(newPos);
      updateFromNpc(id, ENTITY_UPDATE.MOVE, {pos: newPos});
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

/*   if(!intervalId) {
    setIntervalId(setInterval(moveSelf, ENEMY_TICK_DURATION));
  } */

  useEffect(() => {
    if(!alive) {
      updateFromNpc(id, ENTITY_UPDATE.DEAD);
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

  let fovWidth = fov.range * GRID_SIZE;
  let fovHeight = Math.sin(fov.field) * fov.range * GRID_SIZE;
  return (
    <div className="enemy" style={{
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      filter: `${flash ? 'brightness(1.5)' : 'none'}`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`
    }}>
      <img src={enemySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
      <div className="fov-cone" style={{left: `${GRID_SIZE/2}px`, top: `${4 - fovHeight/2}px`, width: `${fovWidth}px`, height: `${fovHeight}px`, display: `${alive ? "block" : "none"}`, transform: `rotate(${npc.aim}rad)`, transformOrigin: 'center left'}}>
        <div className="fov-boundary" style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, transform: `rotate(${-fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? "#AA0" : mood === ENTITY_MOOD.COMBAT ? "#F00" : "#0A0"}`}}></div>
        <div className="fov-boundary" style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, transform: `rotate(${fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? "#AA0" : mood === ENTITY_MOOD.COMBAT ? "#F00" : "#0A0"}`}}></div>
      </div>
    </div>
  );
}
