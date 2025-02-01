import {
  GRID_SIZE,
  ENTITY_UPDATE,
  ENTITY_MOOD
 } from "../CONSTANTS";
import { randomIntBetween } from "../METHODS";
import { useContext, useEffect, useState } from "react";
import enemySprite from '../images/enemy.png'
import { GameContext } from "../screens/GameScreen";
import useGridPosition from "../hooks/useGridPosition";

const ENEMY_TICK_DURATION = 1000;
const ODDS_AGAINST_MOVING = 2;
const ODDS_AGAINST_AIMING = 4;
const MAX_AIM_CHANGE = 1;
const BASE_HITPOINTS = 100;

export default function Enemy(props) {
  const { npc, damageTaken, boundaryCollision, sceneryCollision, entityCollision, updateFromNpc } = props;
  const { id, fov, mood } = npc;
  const [ alive, setAlive ] = useState(true);
  const { pos, updatePos } = useGridPosition(npc.id, npc.pos, updateFromNpc, [boundaryCollision, sceneryCollision, entityCollision]);
  const [ flash, setFlash ] = useState(false);
  const [ health, setHealth ] = useState(BASE_HITPOINTS);
  const [ intervalId, setIntervalId ] = useState(0);
  const [ damageTotal, setDamageTotal ] = useState(0);
  const [ aim, setAim ] = useState(npc.aim);
  const { gameStateActive } = useContext(GameContext);

  const updateAim = newAim => {
    setAim(newAim);
    updateFromNpc(id, ENTITY_UPDATE.AIM, {aim: newAim});
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

  const moveRandom = () => {
    if(Math.random() * ODDS_AGAINST_MOVING < 1) {
      updatePos(randomIntBetween(-1, 1), randomIntBetween(-1, 1));
    }
  }

  const aimRandom = () => {
    if(Math.random() * ODDS_AGAINST_AIMING < 1) {
      updateAim(aim + (Math.random() * MAX_AIM_CHANGE - MAX_AIM_CHANGE - 2));
    }
  }

  const doRandomStuff = () => {
    moveRandom();
    aimRandom();
  }

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
  }, [damageTaken]);

  useEffect(() => {
   /*  if (gameStateActive && !intervalId) {
      setIntervalId(setInterval(doRandomStuff, ENEMY_TICK_DURATION));
    } else if (!gameStateActive && intervalId) {
      setIntervalId(clearInterval(intervalId));
    } */
  }, [gameStateActive])

  let fovWidth = fov.range * GRID_SIZE;
  let fovHeight = Math.sin(fov.field) * fov.range * GRID_SIZE;
  return (
    <div className="entity enemy" style={{
      position: "absolute",
      left: `${pos.x * GRID_SIZE}px`,
      top: `${pos.y * GRID_SIZE}px`,
      //filter: `${flash ? 'brightness(1.5)' : 'brightness(1)'} ${npc.kind !== 'technician' ? "hue-rotate(90deg)" : "hue-rotate(0deg)"})`,
      filter: `brightness(${flash ? "1.5" : "1"}) hue-rotate(${npc.kind === "technician" ? "90deg" : "0deg"})`,
      transform: `${alive ? 'none' : 'rotate(90deg)'}`
    }}>
      <img src={enemySprite} alt="hero" width={GRID_SIZE} height={GRID_SIZE}></img>
      <div className="fov-cone" style={{left: `${GRID_SIZE/2}px`, top: `${4 - fovHeight/2}px`, width: `${fovWidth}px`, height: `${fovHeight}px`, display: `${alive ? "block" : "none"}`, transform: `rotate(${aim}rad)`, transformOrigin: 'center left'}}>
        <div className="fov-boundary" style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: ".3", transform: `rotate(${-fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? "#AA0" : mood === ENTITY_MOOD.COMBAT ? "#F00" : "#0A0"}`}}></div>
        <div className="fov-boundary" style={{top: `${fovHeight/2}px`, width: `${fovWidth}px`, opacity: ".3", transform: `rotate(${fov.field / 2}rad)`, backgroundColor: `${mood ===  ENTITY_MOOD.SUS ? "#AA0" : mood === ENTITY_MOOD.COMBAT ? "#F00" : "#0A0"}`}}></div>
      </div>
    </div>
  );
}
